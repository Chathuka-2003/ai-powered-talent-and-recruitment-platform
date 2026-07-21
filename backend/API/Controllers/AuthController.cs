using API.DTOs;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly Infrastructure.Persistence.RecruitmentDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(IUnitOfWork unitOfWork, Infrastructure.Persistence.RecruitmentDbContext context, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var user = await _unitOfWork.Users.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (!user.IsActive)
        {
            return BadRequest(new { message = "User account is inactive." });
        }

        var roleString = MapRoleToString(user.Role);

        return Ok(new AuthResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = roleString,
            Token = GenerateJwtToken(user)
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        if (await _unitOfWork.Users.IsEmailExistsAsync(request.Email))
        {
            return BadRequest(new { message = "Email is already registered." });
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            Role = UserRole.Candidate, // default to Candidate/Jobseeker
            IsActive = true
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Create Candidate profile
        var candidate = new Candidate
        {
            UserId = user.Id,
            ProfessionalHeadline = string.Empty,
            Summary = string.Empty
        };
        await _unitOfWork.Candidates.AddAsync(candidate);
        await _unitOfWork.SaveChangesAsync();

        var roleString = MapRoleToString(user.Role);

        return Ok(new AuthResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = roleString,
            Token = GenerateJwtToken(user)
        });
    }

    [HttpPost("register-recruiter")]
    public async Task<IActionResult> RegisterRecruiter([FromBody] RegisterRecruiterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        if (await _unitOfWork.Users.IsEmailExistsAsync(request.Email))
        {
            return BadRequest(new { message = "Email is already registered." });
        }

        // Find or create Organization
        var allOrgs = await _unitOfWork.Organizations.GetAllAsync();
        var org = allOrgs.FirstOrDefault(o => o.Name.Equals(request.CompanyName, StringComparison.OrdinalIgnoreCase));
        if (org == null)
        {
            org = new Organization
            {
                Name = request.CompanyName,
                Website = string.Empty,
                Address = string.Empty
            };
            await _unitOfWork.Organizations.AddAsync(org);
            await _unitOfWork.SaveChangesAsync();
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            Role = UserRole.Recruiter,
            IsActive = true,
            OrganizationId = org.Id
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var recruiter = new Recruiter
        {
            UserId = user.Id,
            OrganizationId = org.Id,
            JobTitle = request.JobTitle,
            Department = request.Department,
            PhoneNumber = request.PhoneNumber
        };

        _context.Recruiters.Add(recruiter);
        await _context.SaveChangesAsync();

        var roleString = MapRoleToString(user.Role);

        return Ok(new AuthResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = roleString,
            Token = GenerateJwtToken(user)
        });
    }

    private static string MapRoleToString(UserRole role)
    {
        return role switch
        {
            UserRole.Admin => "admin",
            UserRole.Recruiter => "recruiter",
            UserRole.HiringManager => "hiring-manager",
            UserRole.Candidate => "jobseeker",
            _ => "jobseeker"
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings["Key"]));
        
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, MapRoleToString(user.Role))
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
