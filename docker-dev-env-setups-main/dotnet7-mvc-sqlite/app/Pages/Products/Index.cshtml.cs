using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Models;

namespace App.Pages.Products
{
    public class IndexModel : PageModel
    {
        private readonly App.Data.ApplicationDbContext _context;

        public IndexModel(App.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<Product> products { get; set; } = default!;
        public Store? store { get; set; }

        public async Task<IActionResult> OnGetAsync(int? storeId)
        {
            if (storeId is null)
            {
                return NotFound();
            }

            store = await _context.Store.FirstOrDefaultAsync(m => m.Id == storeId);
            if (store is null)
            {
                return NotFound();
            }

            if (_context.Product != null)
            {
                products = await _context.Product
                .Include(p => p.Store).ToListAsync();
            }

            return Page();
        }
    }
}
