using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Common
{    
    /// <summary>
     /// 基类型<see cref="Object"/>扩展辅助操作类
     /// </summary>
    public static class ObjectExtensions
    {
        #region 公共方法

        /// <summary>
        /// 使用 Newtonsoft.Json.JsonConvert 序列化 对象 为 json 字符串数据
        /// </summary>
        /// <param name="value"></param>
        /// <param name="timeFormat">时间格式</param>
        /// <returns></returns>
        public static string ToJsonString(this object value, string timeFormat = "yyyy-MM-dd HH:mm:ss")
        {
            if (string.IsNullOrEmpty(timeFormat))
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(value);
            }
#if DEBUG
            // 调试模式Json字符串格式化
            var returnStr = Newtonsoft.Json.JsonConvert.SerializeObject(value, Formatting.Indented, GetTimeConverter(timeFormat));
#else
            var returnStr = Newtonsoft.Json.JsonConvert.SerializeObject(value, Formatting.None, GetTimeConverter(timeFormat));
#endif
            return returnStr;
        }

        /// <summary>
        /// 根据 timeFormat 创建 IsoDateTimeConverter 对象
        /// </summary>
        /// <param name="timeFormat"></param>
        /// <returns></returns>
        private static Newtonsoft.Json.Converters.IsoDateTimeConverter GetTimeConverter(string timeFormat)
        {
            Newtonsoft.Json.Converters.IsoDateTimeConverter timeConverter = new Newtonsoft.Json.Converters.IsoDateTimeConverter();
            string timeformat = string.Empty;
            foreach (char c in timeFormat)
            {
                if ("YMDHSFymdhsf".IndexOf(c) < 0) //非日期时间的占位符,需要用 ''包含起来
                {
                    timeformat += string.Format("'{0}'", c);
                }
                else
                {
                    timeformat += c;
                }
            }
            timeConverter.DateTimeFormat = timeformat;
            return timeConverter;
        }

        /// <summary>
        /// 反序列
        /// </summary>
        /// <param name="value"></param>
        /// <param name="timeFormat"></param>
        /// <returns></returns>
        public static T FromJsonString<T>(this string value, string timeFormat = "yyyy-MM-dd HH:mm:ss")
        {
            try
            {
                if (string.IsNullOrEmpty(timeFormat))
                {
                    return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(value);
                }
                return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(value, GetTimeConverter(timeFormat));
            }
            catch (Exception ex)
            { }
            return default(T);
        }

        /// <summary>
        /// 根据指定Json的属性名称获取对应属性的值
        /// </summary>
        /// <param name="value"></param>
        /// <param name="objectKey">指定的Json中Key</param>
        /// <returns></returns>
        public static string JsonStringParse(this string value, string objectKey)
        {
            if (string.IsNullOrEmpty(objectKey))
            {
                return string.Empty;
            }
            try
            {
                Newtonsoft.Json.Linq.JObject jObject = Newtonsoft.Json.Linq.JObject.Parse(value);
                if (null != jObject)
                {
                    return jObject[objectKey].ToString();
                }
            }
            catch (Exception)
            { }
            return string.Empty;
        }

        /// <summary>
        /// 把对象类型转化为指定类型，转化失败时返回指定的默认值
        /// </summary>
        /// <typeparam name="T"> 动态类型 </typeparam>
        /// <param name="value"> 要转化的源对象 </param>
        /// <param name="defaultValue"> 转化失败返回的指定默认值 </param>
        /// <returns> 转化后的指定类型对象，转化失败时返回指定的默认值 </returns>
        public static T CastTo<T>(this object value, T defaultValue)
        {
            try
            {
                return CastTo<T>(value);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        /// <summary>
        /// 判断当前值是否介于指定范围内
        /// </summary>
        /// <typeparam name="T"> 动态类型 </typeparam>
        /// <param name="value"> 动态类型对象 </param>
        /// <param name="start"> 范围起点 </param>
        /// <param name="end"> 范围终点 </param>
        /// <param name="leftEqual"> 是否可等于上限（默认等于） </param>
        /// <param name="rightEqual"> 是否可等于下限（默认等于） </param>
        /// <returns> 是否介于 </returns>
        public static bool IsBetween<T>(this IComparable<T> value, T start, T end, bool leftEqual = false, bool rightEqual = false) where T : IComparable
        {
            bool flag = leftEqual ? value.CompareTo(start) >= 0 : value.CompareTo(start) > 0;
            return flag && (rightEqual ? value.CompareTo(end) <= 0 : value.CompareTo(end) < 0);
        }

        /// <summary>
        /// 复制一个对象
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static T Clone<T>(this T obj) where T : new()
        {
            if (null == obj)
            {
                return default(T);
            }
            Type objTye = typeof(T);
            T model = new T();

            PropertyInfo[] properties = objTye.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                if (!property.IsSpecialName && property.CanWrite)
                {
                    object o = property.GetValue(obj, null);
                    if (null != o)
                    {
                        property.SetValue(model, o, null);
                    }
                }
            }
            return model;
        }

        /// <summary>
        ///  判断两个值或对象是否相同
        /// </summary>
        /// <param name="dataType"></param>
        /// <param name="oldObj"></param>
        /// <param name="newObj"></param>
        /// <returns></returns>
        public static bool IsEqual(Type dataType, object oldObj, object newObj)
        {
            if (oldObj == null && newObj == null)
                return true;

            if (dataType == typeof(int))
            {
                return (int)oldObj == (int)newObj;
            }
            else if (dataType == typeof(decimal))
            {
                return (decimal)oldObj == (decimal)newObj;
            }
            else if (dataType == typeof(double))
            {
                return (double)oldObj == (double)newObj;
            }
            else if (dataType == typeof(Guid))
            {
                return (Guid)oldObj == (Guid)newObj;
            }
            else if (dataType == typeof(DateTime))
            {
                return (DateTime)oldObj == (DateTime)newObj;
            }
            else
                return oldObj.Equals(newObj);
        }

        #endregion 公共方法

        #region 公共方法

        /// <summary>
        /// 使用 Newtonsoft.Json.JsonConvert 序列化 对象 为 json 字符串数据
        /// </summary>
        /// <param name="value"></param>
        /// <param name="timeFormat">时间格式</param>
        /// <returns></returns>
        public static string SerializeObject(this object value, string timeFormat = "")
        {
            if (string.IsNullOrEmpty(timeFormat))
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(value);
            }
            //#if DEBUG
            // 调试模式Json字符串格式化
            // var returnStr = Newtonsoft.Json.JsonConvert.SerializeObject(value, Formatting.Indented, GetTimeConverter(timeFormat));
            //#else
            var returnStr = Newtonsoft.Json.JsonConvert.SerializeObject(value, Formatting.None, GetTimeConverter(timeFormat));
            //#endif
            return returnStr;
        }

        /// <summary>
        /// 反序列
        /// </summary>
        /// <param name="value"></param>
        /// <param name="timeFormat"></param>
        /// <returns></returns>
        public static T DeserializeObject<T>(this string value, string timeFormat = "yyyy-MM-dd HH:mm:ss")
        {
            try
            {
                if (string.IsNullOrEmpty(timeFormat))
                {
                    return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(value);
                }
                return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(value, GetTimeConverter(timeFormat));
            }
            catch (Exception ex)
            {
                //Utility.Log.Log4net.Instance["logApiInfo"].Info(string.Format("value:{0},exception:{1}", value, ex.Message));
            }
            return default(T);
        }

        /// <summary>
        /// 解析JSON字符串生成对象实体
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="json">json字符串(eg.{"ID":"112","Name":"石子儿"})</param>
        /// <returns>对象实体</returns>
        public static T DeserializeJsonToObject<T>(string json) where T : class
        {
            try
            {
                JsonSerializer serializer = new JsonSerializer();
                StringReader sr = new StringReader(json);
                object o = serializer.Deserialize(new JsonTextReader(sr), typeof(T));
                T t = o as T;
                return t;
            }
            catch (Exception e)
            {

            }
            return default(T);
        }

        /// <summary>
        /// 根据指定Json的属性名称获取对应属性的值
        /// </summary>
        /// <param name="value"></param>
        /// <param name="objectKey">指定的Json中Key</param>
        /// <returns></returns>
        public static string JsonObjectParse(this string value, string objectKey)
        {
            try
            {
                Newtonsoft.Json.Linq.JObject jObject = Newtonsoft.Json.Linq.JObject.Parse(value);
                if (null != jObject)
                {
                    return jObject[objectKey].ToString();
                }
            }
            catch (Exception)
            { }
            return string.Empty;
        }

        /// <summary>
        /// 把对象类型转化为指定类型
        /// </summary>
        /// <typeparam name="T"> 动态类型 </typeparam>
        /// <param name="value"> 要转化的源对象 </param>
        /// <returns> 转化后的指定类型的对象，转化失败引发异常。 </returns>
        public static T CastTo<T>(this object value)
        {
            object result = CastTo(value, typeof(T));
            return (T)result;
        }

        /// <summary>
        /// 将对象序列化为JSON字符串，不支持存在循环引用的对象
        /// </summary>
        /// <typeparam name="T">动态类型</typeparam>
        /// <param name="value">动态类型对象</param>
        /// <param name="timeFormat">日期格式</param>
        /// <returns>JSON字符串</returns>
        public static string ToJsonString<T>(this T value, string timeFormat = "yyyy-MM-dd HH:mm:ss")
        {
            return value.SerializeObject(timeFormat);
        }

        /// <summary>
        /// 将对象[主要是匿名对象]转换为dynamic
        /// </summary>
        public static dynamic ToDynamic(this object value)
        {
            IDictionary<string, object> expando = new ExpandoObject();
            Type type = value.GetType();
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(type);
            foreach (PropertyDescriptor property in properties)
            {
                var val = property.GetValue(value);
                if (property.PropertyType.FullName.StartsWith("<>f__AnonymousType"))
                {
                    dynamic dval = val.ToDynamic();
                    expando.Add(property.Name, dval);
                }
                else
                {
                    expando.Add(property.Name, val);
                }
            }
            return expando as ExpandoObject;
        }

        #endregion 公共方法

        /// <summary>
        /// 把对象转换为JSON字符串
        /// </summary>
        /// <param name="o">对象</param>
        /// <returns>JSON字符串</returns>
        public static string ToJSON(this object o)
        {
            if (o == null)
            {
                return null;
            }
            return JsonConvert.SerializeObject(o);
        }
        /// <summary>
        /// 把Json文本转为实体
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="input"></param>
        /// <returns></returns>
        public static T FromJSON<T>(this string input)
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(input);
            }
            catch (Exception ex)
            {
                return default(T);
            }
        }
    }
}
