using System;
using System.Web.Mvc;
using House.DataAccess.EF.Contexts;
using House.DataServices.House1.ServicesEF;
using HouseJournals.Models;

namespace HouseJournals.Controllers
{
    public class IntroductionsController : Controller
    {
        private House1Context _context = new House1Context();

        private int _LastArchivedSessionKey = 208;
        private int _DisplayLegislativeDaySession = 302;
        [UserIntranetCheck]
        public ActionResult Index()
        {
            ViewBag.Message = "Journals page.";
            int SessionKey = 0;
            var journalData = new JournalService(_context);

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
            var ViewModel = new JournalViewModels.IntroductionsViewModel();

            // Set values for ViewModel objects.
            ViewModel.ActiveSession = journalData.GetActiveSession(SessionKey);
            ViewModel.DisplayLegislativeDayDefinition = (SessionKey == _DisplayLegislativeDaySession);
            //We do not link to journal pages for sessions before the 79th legislative session.
            //They are found in the reference library.
            if (SessionKey < ViewModel.LastLinkedJournalPageSessionKey)
            {
                return Redirect(string.Format("https://www.lrl.mn.gov/history/journals/journals?body=house&sess={0}",ViewModel.ActiveSession.SessionNumber));
            }

            //Get the session and journal info
            ViewModel.Sessions = journalData.GetJournalSessionList();
            ViewModel.Journals = journalData.GetJournalFiles(SessionKey);
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
