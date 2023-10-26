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
    public class CreateModel : PageModel
    {
        private readonly App.Data.ApplicationDbContext _context;

        public CreateModel(App.Data.ApplicationDbContext context)
        {
            _context = context;
        }

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

            return Page();
        }

        [BindProperty]
        public InputData inputData { get; set; } = default!;

        public Store? store { get; set; } = default!;


        public class InputData
        {

            public String ProductNumber { get; set; } = null!;
            public string Name { get; set; } = null!;
            public string Description { get; set; } = null!;
            public Decimal Price { get; set; } = 0.0M;
            public int StoreId { get; set; }
        }

        // To protect from overposting attacks, see https://aka.ms/RazorPagesCRUD
        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                if (!ModelState.IsValid || _context.Product is null)
                {
                    store = await _context.Store.FirstOrDefaultAsync(m => m.Id == inputData.StoreId);
                    return Page();
                }

                _context.Product.Add(new Product
                {
                    ProductNumber = inputData.ProductNumber,
                    Name = inputData.Name,
                    Description = inputData.Description,
                    Price = inputData.Price,
                    StoreId = inputData.StoreId
                });
                await _context.SaveChangesAsync();

                return RedirectToPage("./Index", new { storeId = inputData.StoreId });
            }
            catch (Exception)
            {
                return NotFound();
            }
        }
    }
}
