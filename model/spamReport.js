const SpamReportModel = require('./model').SpamReportMongo;

/**
 * spam report model
 */
class SpamReport {
    // eslint-disable-next-line require-jsdoc
    constructor(level, type, description) {
        this.level = level;
        this.type = type;
        this.description = description;
    }

    /**
     * create spam report
     */
    saveSpamReport() {
        return new Promise((resolve, reject) => {
            const spamReport = new SpamReportModel({
                level: this.level,
                type: this.type,
                description: this.description
            });
            spamReport.save()
                .then((result) => {
                    this._id = result.id;
                    resolve(result);
                })
                .catch((err) => {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }
}

module.exports = SpamReport;
