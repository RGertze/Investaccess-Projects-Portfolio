using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Models;

namespace App.Pages.Products
{
    public class EditModel : PageModel
    {
        private readonly App.Data.ApplicationDbContext _context;

        public EditModel(App.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public InputData inputData { get; set; } = default!;
        public Store? store { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.Product == null)
            {
                return NotFound();
            }

            var product = await _context.Product.FirstOrDefaultAsync(m => m.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            store = await _context.Store.FirstOrDefaultAsync(m => m.Id == product.StoreId);
            if (store is null)
            {
                return NotFound();
            }

            this.inputData = new InputData
            {
                Id = product.Id,
                ProductNumber = product.ProductNumber,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StoreId = product.StoreId
            };
            ViewData["StoreId"] = new SelectList(_context.Store, "Id", "Address");
            return Page();
        }

        public class InputData
        {
            public int Id { get; set; }
            public String ProductNumber { get; set; } = null!;
            public string Name { get; set; } = null!;
            public string Description { get; set; } = null!;
            public Decimal Price { get; set; } = 0.0M;
            public int StoreId { get; set; }
        }

        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    store = await _context.Store.FirstOrDefaultAsync(m => m.Id == inputData.StoreId);
                    return Page();
                }

                var originalProduct = await _context.Product.FirstOrDefaultAsync(m => m.Id == inputData.Id);
                if (originalProduct is null)
                {
                    return NotFound();
                }

                originalProduct.ProductNumber = inputData.ProductNumber;
                originalProduct.Name = inputData.Name;
                originalProduct.Description = inputData.Description;
                originalProduct.Price = inputData.Price;

                _context.Product.Update(originalProduct);
                await _context.SaveChangesAsync();

                return RedirectToPage("./Index", new { storeId = originalProduct.StoreId });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Page();
            }
        }

        private bool ProductExists(int id)
        {
            return (_context.Product?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
