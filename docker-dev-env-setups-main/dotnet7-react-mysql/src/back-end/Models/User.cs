namespace back_end.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public String Email { get; set; }

    [Required]
    public String Password { get; set; }

    [Required]
    public String RefreshToken { get; set; }

    [Required]
    public String EmailConfirmationToken { get; set; }

    [Required]
    public bool EmailConfirmed { get; set; }


    [ForeignKey(nameof(Role))]
    public int RoleId { get; set; }
    public Role Role { get; set; }


    public List<Todo> Todos { get; set; }
}