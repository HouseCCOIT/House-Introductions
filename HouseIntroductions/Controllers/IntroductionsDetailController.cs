using House.DataAccess.EF.Contexts;
using House.DataServices.House1.ServicesEF;
using HouseIntroductions.IntroductionViewModels;
using HouseIntroductions.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HouseJournals.Controllers
{
    public class IntroductionsDetailController : Controller
    {
        private House1Context _context = new House1Context();


        [UserIntranetCheck]
        public ActionResult Index(DateTime date, string session, string session_number, bool All = false)
        {
            ViewBag.Message = "Introduction Detail page.";
            
            var introductionData = new IntroductionService(_context);

            //Get the session key from the URL. If none is provided, use the current session.
            


            //Instantiate Journal View Model.
            var ViewModel = new IntroductionsDetailViewModel();

            // Set values for ViewModel objects.
            ViewModel.date = date;
            ViewModel.session = session;
            ViewModel.session_number = session_number;
            ViewModel.All = All;
            if (All)
            {
                ViewModel.Introductions = introductionData.GetIntroductions(Convert.ToInt32(session));
            }
            else
            {
                ViewModel.Introductions = introductionData.GetIntroductions(date);
            }
            

            return View(ViewModel);
        }
    }
}