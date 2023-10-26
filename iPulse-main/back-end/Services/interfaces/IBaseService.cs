using iPulse_back_end.Models;


namespace iPulse_back_end.Services;

public interface IBaseService<TFilter, TAdd, TEdit>
{
    public Task<Response> GetOne(int id);
    public Task<Response> GetAllBy(TFilter details);
    public Task<Response> Add(TAdd details);
    public Task<Response> Edit(TEdit details);
    public Task<Response> Delete(int id);
}