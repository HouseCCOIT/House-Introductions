using System.Web.Mvc;
using System.Web.Routing;

namespace HouseIntroductions
{
    public class RouteConfig
    {


        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "JournalIndex",
                url: "Index/{id}",
                defaults: new { controller = "Journals", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "JournalHome",
                url: "Journals",
                defaults: new { controller = "Journals", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Journals", action = "Index", id = UrlParameter.Optional }
            );

            

            routes.MapRoute(
                name: "JournalFiles",
                url: "Journals/{id}",
                defaults: new { controller = "Journals", action = "Index", id = UrlParameter.Optional }
            );

            
        }



    }
}