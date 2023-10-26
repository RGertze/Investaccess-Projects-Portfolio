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

namespace App.Pages.Employees
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

        public Store? store { get; set; } = default!;


        public class InputData
        {
            public int Id { get; set; }
            public String EmployeeNumber { get; set; } = null!;
            public string Name { get; set; } = null!;
            public string Surname { get; set; } = null!;
            public string Cell { get; set; } = null!;
            public int StoreId { get; set; }
        }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.Employee == null)
            {
                return NotFound();
            }

            var employee = await _context.Employee.FirstOrDefaultAsync(m => m.Id == id);
            if (employee == null)
            {
                return NotFound();
            }
            inputData = new InputData
            {
                Id = employee.Id,
                EmployeeNumber = employee.EmployeeNumber,
                Name = employee.Name,
                Surname = employee.Surname,
                Cell = employee.Cell ?? "",
                StoreId = employee.StoreId
            };
            ViewData["StoreId"] = new SelectList(_context.Store, "Id", "Address");
            return Page();
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

                var original = await _context.Employee.FirstOrDefaultAsync(m => m.Id == inputData.Id);
                if (original is null)
                {
                    return NotFound();
                }

                original.EmployeeNumber = inputData.EmployeeNumber;
                original.Name = inputData.Name;
                original.Surname = inputData.Surname;
                original.Cell = inputData.Cell;

                _context.Employee.Update(original);
                await _context.SaveChangesAsync();

                return RedirectToPage("./Index", new { storeId = original.StoreId });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Page();
            }
        }

        private bool EmployeeExists(int id)
        {
            return (_context.Employee?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
