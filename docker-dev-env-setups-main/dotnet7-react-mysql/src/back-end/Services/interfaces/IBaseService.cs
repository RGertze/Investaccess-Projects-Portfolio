// create an interface that includes add/update/delete/getbyid/getall methods
namespace back_end.Services.Interfaces;

using back_end.Models;

public interface IBaseService<T> where T : class
{
    Task<Result> Add(T entity);
    Task<Result> Update(T entity);
    Task<Result> Delete(T entity);
    Task<Result> GetById(int id);
    Task<Result> GetAll();
}