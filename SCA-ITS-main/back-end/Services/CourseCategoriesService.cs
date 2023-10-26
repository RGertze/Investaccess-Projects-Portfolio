using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class CourseCategoriesService
{
    private readonly SCA_ITSContext dbContext;
    private MoodleService moodleService;
    private CoursesService coursesService;

    public CourseCategoriesService(SCA_ITSContext dbContext, MoodleService moodleService, CoursesService coursesService)
    {
        this.dbContext = dbContext;
        this.moodleService = moodleService;
        this.coursesService = coursesService;
    }

    //----   GET ALL   ----
    /// <summary>Retrieves all course categories</summary>
    /// <param name="searchParams">Search params</param>
    /// <returns>A response containing categories</returns>
    public async Task<Response> GetAll(SearchCourseCategories searchParams)
    {
        try
        {
            var records = await (
                from cat in dbContext.CourseCategories
                from parentCat in dbContext.CourseCategories.Where(c => c.MoodleId == cat.ParentCategoryId).DefaultIfEmpty()
                where cat.Name.ToLower().Contains((searchParams.name ?? cat.Name).ToLower())
                && cat.Description.ToLower().Contains((searchParams.description ?? cat.Description).ToLower())
                && cat.ParentCategoryId == (searchParams.parentCategoryId ?? cat.ParentCategoryId)

                // dont return default category
                && cat.Id != 1

                select new
                {
                    id = cat.MoodleId,
                    cat.Name,
                    cat.Description,
                    parentCategoryId = (parentCat != null) ? parentCat.MoodleId : 0,
                    parentCategoryName = (parentCat != null) ? parentCat.Name : "Top Level",
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    //----   ADD   ----
    /// <summary>Adds a course category to the database.</summary>
    /// <param name="details">The details of the course category to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> Add(AddCourseCategory details, bool addToMoodle, int moodleId = 0)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // check if parent category exists
            if (details.parentCategoryId != 0)
            {
                if (!await dbContext.CourseCategories.AnyAsync(cat => cat.MoodleId == details.parentCategoryId))
                    return new Response { errorMessage = "Parent category not found", data = 404 };

                // prevent adding to default category
                if (details.parentCategoryId == 1)
                    return new Response { errorMessage = "Cannot add to default category", data = 409 };
            }


            // if moodleId is not 0 and add to moodle is false, check if it exists
            if (!addToMoodle && moodleId != 0)
            {
                if (await dbContext.CourseCategories.AnyAsync(cat => cat.MoodleId == moodleId))
                    return new Response { errorMessage = "category already exists", data = 409 };
            }

            var category = new CourseCategory()
            {
                ParentCategoryId = (int)details.parentCategoryId,
                MoodleId = moodleId,
                Name = details.name,
                Description = details.description
            };

            // create on moodle
            if (addToMoodle)
            {
                var result = await moodleService.AddCourseCategory(new MoodleAddCourseCategory
                {
                    name = details.name,
                    description = details.description,
                    parentId = (int)details.parentCategoryId
                });

                if (result.errorMessage != "")
                    return new Response { errorMessage = "Failed to create moodle course category: " + result.errorMessage, data = result.data };

                var responseDate = (MoodleAddCourseCategoryResponse)result.data;

                category.MoodleId = responseDate.id;
            }

            // store in local db
            await dbContext.CourseCategories.AddAsync(category);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  EDIT   ----*/
    /// <summary>Edits a course category.</summary>
    /// <param name="details">The details of the category to edit.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> Edit(UpdateCourseCategory details, bool updateOnMoodle)
    {
        try
        {
            if (details.id is null)
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var record = await dbContext.CourseCategories.FirstOrDefaultAsync(cat => cat.MoodleId == details.id);
            if (record is null)
                return new Response { errorMessage = "Not found", data = 404 };

            record.Name = details.name ?? record.Name;
            record.Description = details.description ?? record.Description;

            // if parent is changed, check that it is valid
            if (details.parentCategoryId is not null)
            {
                if (details.parentCategoryId != 0)
                {
                    var parentCategory = await dbContext.CourseCategories.FirstOrDefaultAsync(cat => cat.MoodleId == details.parentCategoryId);
                    if (parentCategory is null)
                        return new Response { errorMessage = "New parent category not found", data = 404 };
                }

                record.ParentCategoryId = (int)details.parentCategoryId;
            }

            dbContext.CourseCategories.Update(record);
            await dbContext.SaveChangesAsync();

            // update on moodle
            if (updateOnMoodle)
            {
                var result = await moodleService.UpdateCourseCategory(new MoodleUpdateCourseCategoryRequest
                {
                    id = (int)details.id,
                    name = record.Name,
                    description = record.Description
                });
                if (result.errorMessage != "")
                    return new Response { errorMessage = "Failed to update moodle course category: " + result.errorMessage, data = result.data };
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE   ----*/
    /// <summary>
    ///     Deletes a course category.
    /// </summary>
    /// <param name="details">The details of the category to delete.</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> Delete(DeleteCourseCategory details, bool deleteOnMoodle)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "Empty values", data = 400 };
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var record = await dbContext.CourseCategories.FirstOrDefaultAsync(cat => cat.MoodleId == details.moodleId);
            if (record is null)
                return new Response { errorMessage = "Not found", data = 404 };

            if (record.Id == 1)
                return new Response { errorMessage = "Cannot delete default category", data = 400 };


            var recordsToDelete = new List<CourseCategory>() { record };

            // move child categories if newParent is greater than 0 and delete is 0
            if (details.newParentId > 0 && details.deleteRecursively == 0)
            {
                var newParent = await dbContext.CourseCategories.FirstOrDefaultAsync(cat => cat.MoodleId == details.newParentId);
                if (newParent is null)
                    return new Response { errorMessage = "New Parent Category Not Found", data = 404 };

                var children = await dbContext.CourseCategories.Where(cat => cat.ParentCategoryId == record.MoodleId).ToListAsync();
                for (int i = 0; i < children.Count; i++)
                {
                    children[i].ParentCategoryId = (int)newParent.MoodleId;
                }

                dbContext.CourseCategories.UpdateRange(children);
                await dbContext.SaveChangesAsync();
            }

            /*
            *   Move child courses to either the new parent category or to 
            *   the Default_Category category if delete recursive is 0.
            *
            *   Dont update on moodle, that will happen automatically.
            */
            if (details.deleteRecursively == 0)
            {
                var courses = await dbContext.Courses.Where(c => c.CategoryId == record.MoodleId).ToListAsync();
                courses.ForEach(c =>
                {
                    c.CategoryId = details.newParentId <= 0 ? 1 : (int)details.newParentId;
                });
                dbContext.Courses.UpdateRange(courses);
                await dbContext.SaveChangesAsync();
            }

            // get all children if recursive delete was chosen
            if (details.deleteRecursively == 1)
            {
                var childrenToDelResult = await GetAllCategoryChildren((int)record.MoodleId);
                if (childrenToDelResult.errorMessage != "")
                    return childrenToDelResult;

                recordsToDelete.AddRange(childrenToDelResult.data);
            }

            dbContext.CourseCategories.RemoveRange(recordsToDelete);
            await dbContext.SaveChangesAsync();

            // delete on moodle
            if (deleteOnMoodle)
            {
                var result = await moodleService.DeleteCourseCategory(new MoodleDeleteCourseCategoryRequest
                {
                    id = (int)details.moodleId,
                    newParentId = (int)details.newParentId,
                    recursiveDelete = (int)details.deleteRecursively
                });
                if (result.errorMessage != "")
                    return new Response { errorMessage = "Failed to delete course category: " + result.errorMessage, data = result.data };
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }


    /*----  GET ALL CHILDREN OF CATEGORY   ----*/
    public async Task<Response> GetAllCategoryChildren(int parentMoodleId)
    {
        try
        {
            var records = await dbContext.CourseCategories.Where(cat => cat.ParentCategoryId == parentMoodleId).ToListAsync();
            var recordsToReturn = new List<CourseCategory>(records);
            for (int i = 0; i < records.Count; i++)
            {
                var result = await GetAllCategoryChildren((int)records[i].MoodleId);
                if (result.errorMessage != "")
                    return result;

                recordsToReturn.AddRange(result.data);
            }

            return new Response { errorMessage = "", data = recordsToReturn };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured retrieving sub categories: " + ex.Message, data = 500 };
        }
    }
}