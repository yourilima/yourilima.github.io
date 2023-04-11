using System.Text;
using System.IO.Compression;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using System.Web;

namespace TeamCreator;
public class MemberRepository : IRepository<Member>
{
    private readonly NavigationManager navManager;
    private readonly ILogger<MemberRepository> logger;

    private Uri request => new Uri(navManager.Uri);

    public string compressedData {get;set;}

    private byte[] Data => (compressedData ?? "").Split(";").Select(s => string.IsNullOrEmpty(s)?(byte)0:byte.Parse(s)).ToArray();
    private IEnumerable<Member> Members
    {
        get
        {
            var json = Encoding.UTF8.GetString(Decompress(Data));
            if(string.IsNullOrEmpty(json)) {
                json = "[]";
            }
            return JsonSerializer.Deserialize<IEnumerable<Member>>(json); 
        }
    }

    public MemberRepository(NavigationManager navManager, ILogger<MemberRepository> logger)
    {
        this.navManager = navManager ?? throw new ArgumentNullException(nameof(navManager));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public async Task<Member> Get(string Id)
    {
        return Members.FirstOrDefault(m => m.Name == Id);
    }

    public async Task<IEnumerable<Member>> GetAll()
    {
        logger.LogInformation("get all members");
        logger.LogInformation($"total: {Members.Count()}");
        return Members;
    }

    public async Task Add(Member member) {
        var copy = Members.ToList();
        copy.Add(member);
        await Save(copy);
    }
    private byte[] Compress(byte[] bytes)
    {
        logger.LogInformation("compressing");
        using (var memoryStream = new MemoryStream())
        {
            using (var gzipStream = new GZipStream(memoryStream, CompressionLevel.Optimal))
            {
                gzipStream.Write(bytes, 0, bytes.Length);
            }
            return memoryStream.ToArray();
        }
    }
    private byte[] Decompress(byte[] bytes)
    {
        using (var memoryStream = new MemoryStream(bytes))
        {
            using (var outputStream = new MemoryStream())
            {
                using (var decompressStream = new GZipStream(memoryStream, CompressionMode.Decompress))
                {
                    decompressStream.CopyTo(outputStream);
                }
                return outputStream.ToArray();
            }
        }
    }

    public async Task Save(IEnumerable<Member> members)
    {
        var data = JsonSerializer.Serialize<IEnumerable<Member>>(members);
        var compress = Compress(Encoding.UTF8.GetBytes(data));
        navManager.NavigateTo($"{string.Join(";",compress)}",true,false);
    }
}