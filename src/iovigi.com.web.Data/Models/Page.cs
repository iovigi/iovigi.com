﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace iovigi.com.web.Data.Models
{
    public class Page
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Body { get; set; }

        public virtual ICollection<PageTag> Tags { get; set; }
        public virtual ICollection<PageKeyword> Keywords { get; set; }
        public virtual ICollection<PageComment> Comments { get; set; }
    }
}
