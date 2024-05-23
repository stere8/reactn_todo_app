using Microsoft.EntityFrameworkCore;
using TaskManagment.Server.Models;
using TaskManagment.Server.Data;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Configure the DbContext with the correct connection string
builder.Services.AddDbContext<TaskManagmentServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TaskManagmentServerContext") ?? throw new InvalidOperationException("Connection string 'TaskManagmentServerContext' not found.")));

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();