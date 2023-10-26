using System;
using System.Collections.Generic;

namespace back_end.DB_Models;

public partial class Item
{
    public int ItemId { get; set; }

    public int CategoryId { get; set; }

    public string ItemName { get; set; } = null!;

    public string ItemDescription { get; set; } = null!;

    public decimal CreatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;
}
