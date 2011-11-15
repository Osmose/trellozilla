var Bugzilla = {
    API: 'https://api-dev.bugzilla.mozilla.org/test/latest/',
    search: function(params) {
        return this._ajax('bug', 'GET', params);
    },
    _ajax: function(path, type, data) {
        return $.ajax({
            url: this.API + path,
            type: type,
            data: data,
            dataType: 'json'
        });
    }
};
