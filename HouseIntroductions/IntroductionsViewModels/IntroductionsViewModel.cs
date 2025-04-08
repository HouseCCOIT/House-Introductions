using House.DataServices.House1.Models;
using System.Collections.Generic;

namespace HouseIntroductions.IntroductionViewModels
{
    public class IntroductionsViewModel : LayoutViewModel
    {
        //We do not link to journal pages for sessions before the 79th legislative session.
        //They are found in the reference library.
        private int _lastLinkedJournalPageSessionNumber = 79;
        private int _lastLinkedJournalPageSessionKey = 208;
        public IEnumerable<JournalSession> Sessions { set; get; }
        public JournalSession ActiveSession { set; get; }
        public IEnumerable<JournalFile> Journals { set; get; }

        public int LastLinkedJournalPageSessionNumber
        { 
            get { return _lastLinkedJournalPageSessionNumber; }
        }

        public int LastLinkedJournalPageSessionKey
        {
            get { return _lastLinkedJournalPageSessionKey; }
        }

        public bool DisplayLegislativeDayDefinition { get; set; } = false;
    }
}