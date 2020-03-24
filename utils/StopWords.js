const stopwords = require('n-stopwords')(['en']);

class StopWords{

    /**
     * Method to remove stop words from the keywords send in the parameter
     * @param keywords
     * @returns {Promise<*>}
     */
    static async removeStopWords(keywords){
        stopwords.add(['dear','tis','twas']);
        return await stopwords.cleanText(keywords);
    }
}

module.exports = StopWords
