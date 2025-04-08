using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace HouseIntroductions.Models
{
    public class UserIntranetCheck : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            filterContext.Controller.ViewBag.Intranet = CheckRequest();
        }

        private bool CheckRequest()
        {
            // Get IP from request.
            string ip = HttpContext.Current.Request.UserHostAddress;

            // Instantiate list of allowed IPs for intranet links.
            List<string> IntranetIPStarts = new List<string> {
            "10.0.","10.11.",
            "10.12.","10.20.",
            "10.30.","10.40.",
            "10.50.","10.60.",
            "10.61.","10.70.",
            "10.71.",
            "10.90.","10.91.",
            "10.201.",
            "156.98.78.","156.98.227.",
            "156.98.",
            "156.99.14.161","156.98.228."
        };

            // Return true if ip is one of the accepted intranet IPs.
            foreach (string CheckIP in IntranetIPStarts)
            {
                if (ip.StartsWith(CheckIP))
                {
                    return true;
                }
            }

            return false;
        }
    }
   
}