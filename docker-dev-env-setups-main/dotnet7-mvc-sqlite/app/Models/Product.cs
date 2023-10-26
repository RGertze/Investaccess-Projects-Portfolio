
namespace App.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[Index(nameof(ProductNumber), IsUnique = true)]
public class Product
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public String ProductNumber { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string Description { get; set; } = null!;

    [Required]
    public Decimal Price { get; set; } = 0.0M;


    [ForeignKey(nameof(Store))]
    public int StoreId { get; set; }
    public Store Store { get; set; } = null!;
}