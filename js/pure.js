console.log("Pure JS");

(function(){
  var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]); // passes back stuff we need
    }
  };
  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }

  /**
   * Since we dont have import and require in here. so this Object below is like naked in here
   *
   * ClincsWidget use for fetching data from api and display them in a table, so calling it by:
   * 1. $$("section#clinics").createClincsWidget()
   *  - this will need to extend querySelector API, not ideal
   * 2. ClincsWidget.init(el);
   *  - the return object can be use to store in somewhere, also el.data("widget") has the ref as well
   */
  var ClincsWidget = {
    init : function(el){
      this.el = el;
      this.contentEl = el.querySelector(".content");
      this.selectEl = el.querySelector("select");
      el.dataset["widget"] = this;
      var btn = el.querySelector(".clinics-get-btn");
      btn.addEventListener("click", this.fetchData.bind(this));
    },
    fetchData : function(){
      // fetch resouce from api;
      var api = "https://data.gov.uk/data/api/service/health/sql?query={q}"
      var number = this.selectEl.value;
      var url = api.replace('{q}', "SELECT * FROM clinics LIMIT {value}").replace("{value}", number);
      var self = this;
      fetch(url)
      .then(function(response){
        return response.json();
      }).then(function(json){
        return self.template(json);
      }).then(function(table){
        return self.display(table);
      });
    },
    template: function(data){
      if (data["success"]) {
        var rows = data["result"];
        var thList = [];
        if (rows[0]){
          thList = Object.keys(rows[0]);
          thList = thList.filter(function(k){
            expections = ["latlong", "sub_type", "longitude", "latitude", "organisation_type"];
            return !(expections.indexOf(k)>=0);
          });
        }
        var thTemplate = thList.map(function(v, i, arr){
          return "<th>"+escapeHTML(v)+"</th>";
        });

        var trList = []
        trList = rows.map(function(v, i, arr){
          tdList = thList.map(function(k){
            return "<td>"+ escapeHTML(v[k]) +"</td>";
          });
          return "<tr>"+ tdList.join("") +"</tr>";
        });
      }
      return "<table>" +
        "<thead>" + thTemplate.join("") + "</thead>" +
        "<tbody>" + trList + "</tbody>" +
      "</table>";
    },
    display: function(content){
      // clear the table
      var table = this.contentEl.querySelector('table');
      if (table) {
        table.remove();
      }
      // append the table to contentEl
      var div = document.createElement('div');
      div.innerHTML = content;
      var node = div.getElementsByTagName("table")[0];
      this.contentEl.appendChild(node);
    }
  }

  var $$ = document.querySelectorAll.bind(document);
  forEach($$("#demo-table"), function(index, el){
    var w = Object.create(ClincsWidget);
    w.init(el);
  });


})();