using Domain.Entities;
using Domain.Enums;
using Infrastructure.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static void Seed(RecruitmentDbContext context)
    {
        // 1. Seed Organization
        var org = context.Organizations.FirstOrDefault(o => o.Name == "TalentAI Inc.");
        if (org == null)
        {
            org = new Organization
            {
                Name = "TalentAI Inc.",
                Description = "A forward-thinking AI powered recruiting platform developer.",
                Website = "https://talentai.io",
                Address = "San Francisco, CA"
            };
            context.Organizations.Add(org);
            context.SaveChanges();
        }

        // 2. Seed Admin
        var adminEmail = "admin@gmail.com";
        var adminUser = context.Users.FirstOrDefault(u => u.Email == adminEmail);
        if (adminUser == null)
        {
            adminUser = new User
            {
                FirstName = "System",
                LastName = "Administrator",
                Email = adminEmail,
                PasswordHash = PasswordHasher.HashPassword("Admin@123"),
                Role = UserRole.Admin,
                IsActive = true
            };
            context.Users.Add(adminUser);
            context.SaveChanges();
        }

        // 3. Seed Recruiter
        var recruiterEmail = "recruiter@gmail.com";
        var recruiterUser = context.Users.FirstOrDefault(u => u.Email == recruiterEmail);
        Recruiter? recruiter = null;
        if (recruiterUser == null)
        {
            recruiterUser = new User
            {
                FirstName = "Sarah",
                LastName = "Connor",
                Email = recruiterEmail,
                PasswordHash = PasswordHasher.HashPassword("Recruiter@123"),
                Role = UserRole.Recruiter,
                IsActive = true
            };
            context.Users.Add(recruiterUser);
            context.SaveChanges();

            recruiter = new Recruiter
            {
                UserId = recruiterUser.Id,
                OrganizationId = org.Id,
                Department = "Tech Recruiting",
                JobTitle = "Senior Talent Acquisition"
            };
            context.Recruiters.Add(recruiter);
            context.SaveChanges();
        }
        else
        {
            recruiter = context.Recruiters.FirstOrDefault(r => r.UserId == recruiterUser.Id);
        }

        // 4. Seed Hiring Manager
        var managerEmail = "manager@gmail.com";
        var managerUser = context.Users.FirstOrDefault(u => u.Email == managerEmail);
        if (managerUser == null)
        {
            managerUser = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = managerEmail,
                PasswordHash = PasswordHasher.HashPassword("Manager@123"),
                Role = UserRole.HiringManager,
                IsActive = true
            };
            context.Users.Add(managerUser);
            context.SaveChanges();

            var manager = new HiringManager
            {
                UserId = managerUser.Id,
                OrganizationId = org.Id,
                Department = "Engineering",
                Designation = "Engineering Director"
            };
            context.HiringManagers.Add(manager);
            context.SaveChanges();
        }

        // 5. Seed Candidate / Job Seeker
        var candidateEmail = "candidate@gmail.com";
        var candidateUser = context.Users.FirstOrDefault(u => u.Email == candidateEmail);
        if (candidateUser == null)
        {
            candidateUser = new User
            {
                FirstName = "Jane",
                LastName = "Doe",
                Email = candidateEmail,
                PasswordHash = PasswordHasher.HashPassword("Candidate@123"),
                Role = UserRole.Candidate,
                IsActive = true
            };
            context.Users.Add(candidateUser);
            context.SaveChanges();

            var candidate = new Candidate
            {
                UserId = candidateUser.Id,
                ProfessionalHeadline = "Senior Frontend Engineer",
                Summary = "Experienced software engineer specializing in React and frontend architectures.",
                Location = "San Francisco, CA",
                IsOpenToWork = true
            };
            context.Candidates.Add(candidate);
            context.SaveChanges();
        }

        // 6. Seed Jobs
        if (!context.Jobs.Any() && recruiter != null)
        {
            var jobs = new List<Job>
            {
                new Job
                {
                    RecruiterId = recruiter.Id,
                    OrganizationId = org.Id,
                    Title = "Senior React Developer",
                    Description = "We are looking for a Senior React Developer to join our core team. You will be responsible for building premium user interfaces and responsive layouts.",
                    Location = "San Francisco, CA (Hybrid)",
                    EmploymentType = "Full-time",
                    MinimumSalary = 120000,
                    MaximumSalary = 150000,
                    ExpiryDate = DateTime.UtcNow.AddDays(30),
                    Status = JobStatus.Active
                },
                new Job
                {
                    RecruiterId = recruiter.Id,
                    OrganizationId = org.Id,
                    Title = "Full Stack .NET Engineer",
                    Description = "Join our product engineering division to scale web services and build APIs using ASP.NET Core and Entity Framework.",
                    Location = "Remote (US/Canada)",
                    EmploymentType = "Full-time",
                    MinimumSalary = 110000,
                    MaximumSalary = 140000,
                    ExpiryDate = DateTime.UtcNow.AddDays(30),
                    Status = JobStatus.Active
                },
                new Job
                {
                    RecruiterId = recruiter.Id,
                    OrganizationId = org.Id,
                    Title = "AI / ML Scientist",
                    Description = "Lead the design and development of AI-powered recommendation systems for matching candidates to jobs.",
                    Location = "New York, NY (Onsite)",
                    EmploymentType = "Full-time",
                    MinimumSalary = 160000,
                    MaximumSalary = 200000,
                    ExpiryDate = DateTime.UtcNow.AddDays(30),
                    Status = JobStatus.Active
                }
            };
            context.Jobs.AddRange(jobs);
            context.SaveChanges();
        }
    }
}
