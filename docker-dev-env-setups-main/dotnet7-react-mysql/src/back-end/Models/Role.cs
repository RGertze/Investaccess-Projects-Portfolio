namespace back_end.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Role
{
    [Key]
    public int Id { get; set; }

    [Required]
    public String Name { get; set; }

    [Required]
    public String Description { get; set; }

    public List<User> Users { get; set; }
}