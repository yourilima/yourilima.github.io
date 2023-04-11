namespace TeamCreator;

public interface IRepository<TModel> {
    string compressedData {get;set;}
    Task<TModel> Get(string Id);
    Task<IEnumerable<TModel>> GetAll();
    Task Add(Member member);
    Task Save(IEnumerable<Member> members);
}