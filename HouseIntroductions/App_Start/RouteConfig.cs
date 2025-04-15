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
                name: "IntroductionIndex",
                url: "Index/{id}",
                defaults: new { controller = "Introductions", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "IntroductionHome",
                url: "Introductions",
                defaults: new { controller = "Introductions", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Introductions", action = "Index", id = UrlParameter.Optional }
            );

            

            routes.MapRoute(
                name: "IntroductionFiles",
                url: "Introductions/{id}",
                defaults: new { controller = "Introductions", action = "Index", id = UrlParameter.Optional }
            );

            
        }



    }
}