using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using App.Models;
// using App.Models;

namespace App.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<App.Models.Store> Store { get; set; } = default!;
    public DbSet<App.Models.Employee> Employee { get; set; } = default!;
    public DbSet<App.Models.Product> Product { get; set; } = default!;
}
