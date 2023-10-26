using System;
using System.Collections.Generic;

namespace back_end.DB_Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string CategoryDescription { get; set; } = null!;

    public decimal CreatedAt { get; set; }

    public virtual ICollection<Item> Items { get; } = new List<Item>();
}
