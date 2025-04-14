using House.DataServices.House1.Models;
using System;
using System.Collections.Generic;

namespace HouseIntroductions.IntroductionViewModels
{
    public class IntroductionsDetailViewModel
    {
        public IEnumerable<Introduction> Introductions { set; get; }

        public DateTime date { get; set; }
        public String session { set; get; } //Used for revisor site
        public String session_number { set; get; } //Used for revisor site
        public bool All { get; set; }
    }
}