using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace mymvc.Models
{

    /// <summary>
    /// 对象的每一个实例都对应数据库表中的一行，而类的每个属性都将映射到该表中的列
    /// </summary>
    public class Movie
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public DateTime RelaseDate { get; set; }
        public string Genre { get;  set; }
        public decimal Price { get;  set; }
        public string Rating { get; set; }
    }

    /// <summary>
    /// EF的电影数据库上下文，用于处理数据库中Movie类实体的提取、存储和更新
    /// </summary>
    public class MovieDBContext : DbContext { 
    
        public DbSet<Movie> Movies { get; set; }
    }
}