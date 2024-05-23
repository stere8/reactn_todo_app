using Microsoft.EntityFrameworkCore;
using TaskManagment.Server.Models;
using Microsoft.Extensions.DependencyInjection;
using TaskManagment.Server.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TaskManagmentServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TaskManagmentServerContext") ?? throw new InvalidOperationException("Connection string 'TaskManagmentServerContext' not found.")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TaskManagmentDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); // Replace "DefaultConnection" with your actual connection string name

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
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
