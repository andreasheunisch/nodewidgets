
nw_valuefilters.euro = function(v) {
    if (v == null) { return null };
    return v.toFixed(2) + '€';
};


nw_valuefilters.euroCent = function(v) {
    if (v == null) { return null };
    return v.toFixed(2) + '¢';
};


nw_valuefilters.integerYesNo = function(v) {
    if (v == null) { return null };
    if (v == 0) {
        return "no";
    }
    return "yes";
};

