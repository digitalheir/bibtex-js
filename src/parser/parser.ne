# For more information, see:
#     http://ftp.math.purdue.edu/mirrors/ctan.org/info/bibtex/tamethebeast/ttb_en.pdf
#     http://artis.imag.fr/~Xavier.Decoret/resources/xdkbibtex/bibtex_summary.html
#     http://www.bibtex.org/Format/


#
# See http://ftp.math.purdue.edu/mirrors/ctan.org/info/bibtex/tamethebeast/ttb_en.pdf:
#
#   There is a special entry type named @comment. The main use of such an entry type is to comment a large part
#    of the bibliography easily, since anything outside an entry is already a comment, and commenting out one
#    entry may be achieved by just removing its initial @
#
# ^ this suggests that opening braces within the comment MUST be closed, and the comment ends on the first ending brace
#   that balances with this opening brace
#
#
# Case-independent sequence of non-whitespace, non-brace, non-commas
#

#
# • Values (i.e. right hand sides of each assignment) can be either between curly braces or between
#   double quotes. The main difference is that you can write double quotes in the first case, and not
#   in the second case.
# • For numerical values, curly braces and double quotes can be omitted.
#
# Text that is enclosed in braces is marked not to be touched by any formating instructions. For instance, when a style defines the title to become depicted using only lowercase, italic letters, the enclosed part will be left untouched. "An Introduction To {BibTeX}" would become ,,an introduction to the BibTeX'' when such a style is applied. Nested braces are ignored.

@{%
var isNumber = function(x) {return x.constructor === Number || (typeof x === "object"&&x.type === "number")};
var tok_id              = {test: function(x) {return typeof x === "object" && x.type === "id"; }}
var entry_type_bib      = {test: function(x) {return typeof x === "object" && x.type === "@bib"; }}
var entry_type_string   = {test: function(x) {return typeof x === "object" && x.type === "@string"; }}
var entry_type_preamble = {test: function(x) {return typeof x === "object" && x.type === "@preamble"; }}
var entry_type_comment  = {test: function(x) {return typeof x === "object" && x.type === "@comment"; }}
var ws                  = {test: function(x) {return typeof x === "object" && x.type === "ws";}}
var num                 = {test: isNumber}
var pound               = {literal: "#" }
var eq                  = {literal: "=" }
var esc                 = {literal: "\\" }
var paren_l             = {literal: "(" }
var paren_r             = {literal: ")" }
var brace_l             = {literal: "{" }
var brace_r             = {literal: "}" }
var quote_dbl           = {literal: '"' }
var comma               = {literal: "," }


function addToObj(obj, keyval){
  if(keyval.type !== "keyval") throw new Error("Expected a keyval object");
  var key = keyval.key.toLowerCase();
      if(obj.fields[key]) {
      console.log("WARNING: field "+key+ " was already defined on object "+obj._id+". Ignoring this value.");
      return;
    }else{
      obj.fields[key]=keyval.value;
      return obj;
    }
}

function joinTokens(arr){
    var strs = [];
    for(var i=0;i<arr.length;i++){
      if(typeof arr[i] === "object"){
        if(!arr[i].string) throw new Error("Expected token to have a string field called 'string' in object "+JSON.stringify(arr[i]));
        strs.push(arr[i].string);
      } else if(typeof arr[i] === "string" || typeof arr[i] === "number"){
        strs.push(arr[i]);
      } else throw new Error("Could not handle token "+JSON.stringify(arr[i]) +" in array "+JSON.stringify(arr));
    }
    return strs.join('');
}

%}

#####################
# A bibfile is a sequence of entries, with comments interspersed
# Note that % is "is not a comment character in the database files"
# (ftp://ftp.ctan.org/tex-archive/biblio/bibtex/contrib/doc/btxdoc.pdf)
#####################
main  -> non_entry:? (entry non_entry:?):*  {%
                                                   function (data, location, reject) {
                                                     var topLevelObjects = [];
                                                     //console.log(JSON.stringify(data));
                                                     if(data[0])
                                                        topLevelObjects.push({type: "NON_ENTRY", data: data[0]});

                                                     for(var i=0;i < data[1].length;i++){

                                                      topLevelObjects.push({type: "ENTRY", data: data[1][i][0]});

                                                      if(data[1][i][1])
                                                        topLevelObjects.push({type: "NON_ENTRY", data: data[1][i][1]});
                                                     }
                                                     return topLevelObjects;
                                                   }
                                                 %}
_ -> %ws:*
parenthesized[X]        -> %paren_l $X %paren_r {% function (data, location, reject) { return data[1]; } %}
braced[X]               -> %brace_l $X %brace_r {% function (data, location, reject) { return data[1]; } %}
parenthesizedPadded[X]  -> %paren_l _ $X _ %paren_r  {% function (data, location, reject) { return data[2]; } %}
bracedPadded[X]         -> %brace_l _ $X _ %brace_r  {% function (data, location, reject) { return data[2]; } %}

#####################
# ENTRY
#####################
entry_decl         -> (%entry_type_bib |
                         %entry_type_string |
                         %entry_type_preamble |
                         %entry_type_comment)            {% function (data, location, reject) { return data[0][0]; } %}

entry              -> (bib_entry | string_entry | preamble_entry | comment_entry)
                      {% function (data, location, reject) { return data[0][0]; }%}

#
# See http://ftp.math.purdue.edu/mirrors/ctan.org/info/bibtex/tamethebeast/ttb_en.pdf:
#
#   There is a special entry type named @comment. The main use of such an entry type is to comment a large part
#    of the bibliography easily, since anything outside an entry is already a comment, and commenting out one
#    entry may be achieved by just removing its initial @
#
# ^ this suggests that opening and closing brackets within the comment MUST be closed, and the comment ends on the first ending bracket
#   that balances with the opening bracket
#
comment                    -> main         {%
                                                    function (data, location, reject) {
                                                      return data;
                                                    }
                                                    %}
comment_liberal            -> (.):*                                        {%
                                                                            function (data, location, reject) {
                                                                              var toeknz=[];
                                                                              for(var tk=0; tk < data[0].length; tk++)
                                                                                toeknz.push(data[0][tk][0]);
                                                                              return toeknz;
                                                                            } %}

entry_body_comment         -> (parenthesized[comment] | braced[comment])
{%
  function (data, location, reject) {
    return data[0][0][0];
  }
%}

entry_body_string          -> (parenthesizedPadded[keyval] | bracedPadded[keyval]) {% function (data, location, reject) { return data[0][0][0]; } %}
entry_body_bib             -> (parenthesizedPadded[bib_content] | bracedPadded[bib_content]) {% function (data, location, reject) {
                                                                                                var obj = data[0][0][0];
                                                                                                return obj;
                                                                                              } %}
bib_content                -> key_string _ %comma _ (keyval _ %comma _):* keyval (_ %comma):?
                                                    {% function (data, location, reject) {
                                                           var obj = {
                                                            _id: data[0],
                                                            fields:[]
                                                           };
                                                           var keyvals = data[4];
                                                           for(var kv=0;kv<keyvals.length;kv++) {
                                                             obj.fields.push(keyvals[kv][0]);
                                                           }
                                                           obj.fields.push(data[5]);
                                                           return obj;
                                                       } %}

bib_entry          -> %entry_type_bib      _ entry_body_bib       {% function (data, location, reject) {
                                                                     var obj = {
                                                                                 _id: data[2]._id,
                                                                                };
                                                                     obj["@type"] = data[0].string;
                                                                     obj.fields = {};

                                                                     var keyvals = data[2].fields;
                                                                     for(var kv=0;kv<keyvals.length;kv++) {
                                                                       addToObj(obj, keyvals[kv]);
                                                                     }
                                                                     return obj;
                                                                  }%}
string_entry       -> %entry_type_string   _ entry_body_string    {% function (data, location, reject) { return {type: "string", data: data[2]}; } %}
preamble_entry     -> %entry_type_preamble _ entry_body_comment   {% function (data, location, reject) { return {type: "preamble", data: data[2]}; } %}
comment_entry      -> %entry_type_comment  _ entry_body_comment   {% function (data, location, reject) { return {type: "comment", data: data[2]}; } %}

keyval             -> key_string _ %eq _ value_string
                      {% function (data, location, reject) {return {type: "keyval", key: data[0], value: data[4]};}%}

braced_string         ->  %brace_l (non_brace|braced_string):* %brace_r {% function (data, location, reject) {
                                                                                                    var tkz = [];
                                                                                                    for(var i in data[1]) tkz.push(data[1][i][0]);
                                                                                                    return {type:"braced", data: tkz};
                                                                                                  }

                                                                                                %}
quoted_string        -> %quote_dbl (escaped_quote|non_quote_non_brace|braced_string):* %quote_dbl
                        {% function (data, location, reject) {
                             var tks = [];
                             for(var i in data[1]) tks.push(data[1][i][0]);
                             return {type:"quotedstring", data:tks};
                           }
                        %}
escaped_quote        -> %esc %quote_dbl
non_quote_non_brace  -> (%tok_id |
                        %entry_type_bib |
                        %entry_type_string |
                        %entry_type_preamble |
                        %entry_type_comment |
                        %ws |
                        %num |
                        %pound |
                        %eq |
                        %esc |
                        %paren_l |
                        %paren_r |
                        %comma)

#
# Case-independent sequence of non-whitespace, non-brace, non-commas
#
key_string         -> stringreftoken:+ {% function (data, location, reject) { return joinTokens(data[0]).toLowerCase(); } %}

#
# • Values (i.e. right hand sides of each assignment) can be either between curly braces or between
#   double quotes. The main difference is that you can write double quotes in the first case, and not
#   in the second case.
# • For numerical values, curly braces and double quotes can be omitted.
#
value_string       ->  (quoted_string_or_ref (_ %pound _ quoted_string_or_ref):* | braced_string)
                      {% function (data, location, reject) {
                             //console.log("DATA",JSON.stringify(data));
                             var match = data[0];
                             if(match.length === 2){
                              // quoted string
                              var tokenz = [];
                              tokenz.push(match[0]);
                              for(var i=0;i<match[1].length;i++) tokenz.push(match[1][i][3]);
                              return {type: "quotedstringwrapper", data: tokenz};
                             } else if(match[0].type === "braced")
                               return {type: "bracedstringwrapper", data: match[0].data};
                             //else if(isNumber(match[0]) return [match[0]];
                             else throw new Error("Don't know how to handle value "+JSON.stringify(match[0]));
                         }
                      %}

quoted_string_or_ref -> (quoted_string | string_ref | %num) {% function (data, location, reject) {
                                                          //console.log(data);
                                                          if (data[0][0].type === "quotedstring") return data[0][0];
                                                          else{return data[0][0];}
                                                        }
                                                     %}

string_ref         -> (stringreftoken_n_num stringreftoken:*)
                      {% function (data, location, reject) { var str = data[0][0]+joinTokens(data[0][1]); return {stringref: str}; } %}

# Non-white non-brace, non-comma
stringreftoken       -> (%esc | %paren_l | %paren_r | %tok_id | %num  | %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment)
{%
   function (data, location, reject) {
     if(typeof data[0][0] === "object") {
       if(!data[0][0].string) throw new Error("Expected "+data[0]+"to have a 'string' field");
       return data[0][0].string;
       } else {
         if((!(typeof data[0][0] === "string"||typeof data[0][0] === "number")))
           throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0];
       }
   }
%}
stringreftoken_n_num -> (%esc | %paren_l | %paren_r | %tok_id |         %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment)
{%
   function (data, location, reject) {
     if(typeof data[0][0] === "object") {
       if(!data[0][0].string) throw new Error("Expected "+data[0]+"to have a 'string' field");
       return data[0][0].string;
       } else {
         if((!(typeof data[0][0] === "string"||typeof data[0][0] === "number")))
           throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0];
       }
   }
%}
non_brace            -> (%esc | %paren_l | %paren_r | %tok_id | %quote_dbl | %ws | %num | %comma | %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment | %pound | %eq)
{% function (data, location, reject) {
  return data[0][0];
}
%}
non_bracket          -> (%esc |                       %tok_id | %quote_dbl | %ws | %num | %comma | %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment | %pound | %eq)
{% function (data, location, reject) {
  return data[0][0];
}
%}

#####################
# NON ENTRY
#####################
non_entry           -> (escaped_entry | escaped_escape | escaped_non_esc_outside_entry | non_esc_outside_entry):+
{% function (data, location, reject) {
  //console.log("non_entry",data);
  var tokens = [];
  for(var Ti = 0;Ti<data[0].length;Ti++) tokens.push(data[0][Ti][0]);
  return tokens;
  }
%}
escaped_escape        -> %esc %esc {% function (data, location, reject) { return '\\'; } %}
escaped_entry         -> %esc entry_decl
                         {% function (data, location, reject) { return {type: "escapedEntry", data: data[1] }; } %}
escaped_non_esc_outside_entry -> %esc non_esc_outside_entry
                         {% function (data, location, reject) { return '\\' + data[1]; } %}
non_esc_outside_entry -> (%tok_id |
                         %ws |
                         %num |
                         %pound |
                         %eq |
                         %paren_l |
                         %paren_r |
                         %brace_l |
                         %brace_r |
                         %quote_dbl |
                         %comma)
                         {% function (data, location, reject) {
                            //console.log("ooutside_entry",data[0][0]);
                            return data[0][0];
                          } %}