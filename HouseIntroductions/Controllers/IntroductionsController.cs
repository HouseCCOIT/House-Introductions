using System;
using System.Web.Mvc;
using House.DataAccess.EF.Contexts;
using House.DataServices.House1.ServicesEF;
using HouseIntroductions.Models;

namespace HouseIntroductions.Controllers
{
    public class IntroductionsController : Controller
    {
        private House1Context _context = new House1Context();


        [UserIntranetCheck]
        public ActionResult Index()
        {
            ViewBag.Message = "Introductions page.";
            int SessionKey = 0;
            var journalData = new JournalService(_context);
            var introductionData = new IntroductionService(_context);

            //Get the session key from the URL. If none is provided, use the current session.
            if (RouteData.Values.Count > 2)
            {
                if (Int32.TryParse(RouteData.Values["id"].ToString(), out int result))
                {
                    SessionKey = result;
                }
                else
                {
                    SessionKey = journalData.GetCurrentSessionKey();
                }
            }
            else
            {
                SessionKey = journalData.GetCurrentSessionKey();
            }
                

            //Instantiate Journal View Model.
            var ViewModel = new IntroductionViewModels.IntroductionsViewModel();

            // Set values for ViewModel objects.
            ViewModel.ActiveSession = introductionData.GetActiveSession(SessionKey);
            

            //Get the session and journal info
            ViewModel.Sessions = introductionData.GetIntroductionSessionList();
            ViewModel.IntroductionLineItems = introductionData.GetIntroductionLineItems(SessionKey);
            return View(ViewModel);
        }


        [HttpPost]
        public ActionResult GetPage(string SessionKey, string PageNumber)
        {
            try
            {
                var journalData = new JournalService(_context);
                var _activeSession = journalData.GetActiveSession(Convert.ToInt32(SessionKey));
                var _fileName = journalData.GetJournalFilePage(Convert.ToInt32(SessionKey), Convert.ToInt32(PageNumber));

                if (String.IsNullOrEmpty(_fileName)) throw new Exception();
                
                return Json(new
                {
                    fileName = _fileName,
                    folder = _activeSession.FolderDisplay
                }
                );
            }
            catch (Exception)
            {

                return new ViewResult() { ViewName = "Error" };
            }
            
        }
    }
}
