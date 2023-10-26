using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Models;

namespace App.Pages.Employees
{
    public class CreateModel : PageModel
    {
        private readonly App.Data.ApplicationDbContext _context;

        public CreateModel(App.Data.ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        ///     Returns the create employee page
        /// </summary>
        /// <param name="storeId">Store id</param>
        /// <returns></returns>
        public async Task<IActionResult> OnGetAsync(int? storeId)
        {
            if (storeId is null)
            {
                return NotFound();
            }

            store = await _context.Store.FirstOrDefaultAsync(m => m.Id == storeId);
            if (store == null)
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
            public String EmployeeNumber { get; set; } = null!;
            public string Name { get; set; } = null!;
            public string Surname { get; set; } = null!;
            public string Cell { get; set; } = null!;
            public int StoreId { get; set; }
        }

        // To protect from overposting attacks, see https://aka.ms/RazorPagesCRUD
        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                if (!ModelState.IsValid || _context.Employee == null)
                {
                    store = await _context.Store.FirstOrDefaultAsync(m => m.Id == inputData.StoreId);
                    return Page();
                }

                _context.Employee.Add(new Employee
                {
                    Name = inputData.Name,
                    Surname = inputData.Surname,
                    Cell = inputData.Cell,
                    EmployeeNumber = inputData.EmployeeNumber,
                    StoreId = inputData.StoreId
                });
                await _context.SaveChangesAsync();

                return RedirectToPage("./Index", new { storeId = inputData.StoreId });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                ModelState.AddModelError("general", "An error occured while saving the employee." + ex.Message);
                return Page();
            }
        }
    }
}
