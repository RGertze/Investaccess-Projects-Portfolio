using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Models;

namespace App.Pages.Stores
{
    public class IndexModel : PageModel
    {
        private readonly App.Data.ApplicationDbContext _context;

        public IndexModel(App.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<Store> Store { get;set; } = default!;

        public async Task OnGetAsync()
        {
            if (_context.Store != null)
            {
                Store = await _context.Store.ToListAsync();
            }
        }
    }
}
