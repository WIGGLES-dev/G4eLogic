export enum StringCompare {
  IsAnything = "is anything",
  Is = "is",
  IsNot = "is not",
  Contains = "contains",
  DoesNotContain = "does not contain",
  StartsWith = "starts with",
  DoesNotStartWith = "does not start with",
  EndsWith = "ends with",
  DoesNotEndWith = "does not end with",
}
export function stringCompare(
  a: string,
  b: string,
  type: StringCompare
): boolean {
  try {
    switch (type) {
      case StringCompare.IsAnything:
        return true;
      case StringCompare.Is:
        return a === b;
      case StringCompare.IsNot:
        return a !== b;
      case StringCompare.Contains:
        return a.includes(b);
      case StringCompare.DoesNotContain:
        return !a.includes(b);
      case StringCompare.StartsWith:
        return a.startsWith(b);
      case StringCompare.DoesNotStartWith:
        return !a.startsWith(b);
      case StringCompare.EndsWith:
        return a.endsWith(b);
      case StringCompare.DoesNotEndWith:
        return !a.endsWith(b);
      default:
        return false;
    }
  } catch (err) {
    return false;
  }
}

export function insensitiveStringCompare(
  string1: string,
  string2: string
): boolean {
  return string1.toLowerCase() === string2.toLowerCase();
}

export function capitalize(string) {
  return string
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function strEncodeUTF16(str: string) {
  return [...str].reduce((prev, cur) => prev + cur.charCodeAt(0), 0);
}

export function interpolate(input: string, context: any) {
  if (!context) return input;
  if (!input.startsWith("`")) input = "`" + input;
  if (!input.endsWith("`")) input = input + "`";
  const params = Object.keys(context);
  const args = Object.values(context);
  try {
    return new Function(...params, `return ${input}`)(...args);
  } catch (err) {
    return err;
  }
}

export function abbreviate(
  str: string,
  { length = 3, keepSeperators = false, strict = true } = {}
): string {
  const regexes = [
    /[\s\-_,]/,
    /[\W]/,
    /[aieouäöü]/,
    /[a-z]/,
    /[AIEOUÄÖÜ]/,
    /[A-Z0-9]/,
  ];
  const digraphs = ["ch", "gh", "gn", "kn", "ph", "qu", "sh", "th", "wh", "wr"];
  const diblends = [
    "bl",
    "br",
    "cl",
    "cr",
    "fl",
    "fr",
    "gl",
    "gr",
    "pl",
    "pr",
    "sc",
    "sl",
    "sm",
    "sn",
    "sp",
    "st",
  ];
  const trigraphs = ["chr", "sch"];
  const triblends = ["shr", "spl", "spr", "squ", "str", "thr"];
  let chars,
    di,
    found,
    i,
    j,
    k,
    keepSeparators,
    l,
    len,
    len1,
    newWord,
    order,
    orderedCount,
    pos,
    ref,
    ref1,
    sep,
    should,
    tri,
    unfinished,
    word,
    words;
  if (length == null) {
    length = 3;
  }
  if (keepSeparators == null) {
    keepSeparators = false;
  }
  if (strict == null) {
    strict = true;
  }
  if (length <= 0 && strict) {
    return "";
  }
  if (length >= str.length) {
    return str;
  }
  str = str.replace(/^[\s\-_,]+/, "").replace(/[\s\-_,]+$/, "");
  if (length >= str.length) {
    return str;
  }
  chars = str.split("");
  pos = 1;
  order = [pos];
  orderedCount = 1;
  word = 1;
  words = [1];
  sep = 0;
  newWord = false;
  found;
  i = 1;
  while (i < chars.length) {
    order.push(0);
    if (chars[i].search(regexes[0]) > -1) {
      words.push(0);
      newWord = true;
      sep++;
    } else {
      if (newWord) {
        newWord = false;
        word++;
        pos++;
        order[i] = pos;
        orderedCount++;
        if (i < chars.length + 2) {
          ref = trigraphs.concat(triblends);
          for (k = 0, len = ref.length; k < len; k++) {
            tri = ref[k];
            if (
              tri[0] === chars[i].toLowerCase() &&
              tri[1] === chars[i + 1].toLowerCase() &&
              tri[2] === chars[i + 2].toLowerCase()
            ) {
              found = true;
              break;
            }
          }
        }
        if (found) {
          found = false;
          pos++;
          order.push(pos);
          orderedCount++;
          pos++;
          order.push(pos);
          orderedCount++;
          words.push(word);
          words.push(word);
          i++;
          i++;
        } else if (i < chars.length + 1) {
          ref1 = digraphs.concat(diblends);
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            di = ref1[l];
            if (
              di[0] === chars[i].toLowerCase() &&
              di[1] === chars[i + 1].toLowerCase()
            ) {
              found = true;
              break;
            }
          }
          if (found) {
            found = false;
            pos++;
            order.push(pos);
            orderedCount++;
            words.push(word);
            i++;
          }
        }
      }
      words.push(word);
    }
    i++;
  }
  if (!strict) {
    should = word;
    if (keepSeparators) {
      should += sep;
    }
    if (length < should) {
      length = should;
    }
  }
  if (keepSeparators) {
    i = 0;
    while (i < chars.length) {
      if (words[i] === 0) {
        order[i] = pos;
        orderedCount++;
        pos++;
      }
      i++;
    }
    pos = chars.length;
  } else {
    pos = chars.length;
    i = chars.length;
    while (i > 0) {
      i--;
      if (words[i] === 0) {
        order[i] = pos;
        orderedCount++;
        pos--;
      }
    }
  }
  j = 1;
  unfinished = true;
  while (j < regexes.length && unfinished) {
    i = chars.length;
    while (i > 0) {
      i--;
      if (!(order[i] > 0)) {
        if (chars[i].search(regexes[j]) > -1) {
          order[i] = pos;
          orderedCount++;
          pos--;
          if (orderedCount === chars.length) {
            unfinished = false;
            break;
          }
        }
      }
    }
    j++;
  }
  chars = chars.map(function (val, i) {
    if (order[i] <= length) {
      return val;
    } else {
      return "";
    }
  });
  return chars.join("");
}
