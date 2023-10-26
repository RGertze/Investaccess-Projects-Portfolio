
namespace App.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[Index(nameof(EmployeeNumber), IsUnique = true)]
public class Employee
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public String EmployeeNumber { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string Surname { get; set; } = null!;

    [Required]
    public string? Cell { get; set; }



    [ForeignKey(nameof(Store))]
    public int StoreId { get; set; }
    public Store Store { get; set; } = null!;
}