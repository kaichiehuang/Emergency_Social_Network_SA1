const stopwords = require('n-stopwords')(['en']);

const WORDS_TO_REMOVE =['above', 'according', 'accordingly', 'actually', 'afterwards', 'again', 'against', 'ain\'t', 'allow', 'allows',
    'alone', 'along', 'already', 'although', 'always', 'amongst', 'another', 'anybody', 'anyhow', 'anyone', 'anything', 'anyway', 'anyways',
    'anywhere', 'apart', 'appear', 'appreciate', 'appropriate', 'aren\'t', 'around', 'a\'s', 'aside', 'ask', 'asking', 'associated', 'available',
    'away', 'awfully', 'became', 'become', 'becomes', 'becoming', 'before', 'beforehand', 'behind', 'being', 'believe', 'below', 'beside', 'besides',
    'best', 'better', 'between', 'beyond', 'both', 'brief', 'came', 'cant', 'can\'t', 'cause', 'causes', 'certain', 'certainly', 'changes', 'clearly',
    'c\'mon', 'co', 'com', 'come', 'comes', 'concerning', 'consequently', 'consider', 'considering', 'contain', 'containing', 'contains', 'corresponding',
    'couldn\'t', 'course', 'c\'s', 'currently', 'definitely', 'described', 'despite', 'didn\'t', 'different', 'doesn\'t', 'doing', 'don', 'done', 'don\'t', 'down',
    'downwards', 'during', 'each', 'edu', 'eg', 'eight', 'elsewhere', 'enough', 'entirely', 'especially', 'et', 'etc', 'even', 'everybody', 'everyone', 'everything',
    'everywhere', 'ex', 'exactly', 'example', 'except', 'far', 'few', 'fifth', 'first', 'five', 'followed', 'following', 'follows', 'former', 'formerly', 'forth',
    'four', 'further', 'furthermore', 'gets', 'getting', 'given', 'gives', 'go', 'goes', 'going', 'gone', 'gotten', 'greetings', 'hadn\'t', 'happens', 'hardly',
    'hasn\'t', 'haven\'t', 'having', 'he\'d', 'he\'ll', 'hello', 'help', 'hence', 'here', 'hereafter', 'hereby', 'herein', 'here\'s', 'hereupon', 'herself', 'he\'s',
    'hi', 'himself', 'hither', 'hopefully', 'howbeit', 'how\'s', 'i\'d', 'ie', 'ignored', 'i\'ll', 'i\'m', 'immediate', 'inasmuch', 'inc', 'indeed', 'indicate', 'indicated',
    'indicates', 'inner', 'insofar', 'instead', 'inward', 'isn\'t', 'it\'d', 'it\'ll', 'it\'s', 'itself', 'i\'ve', 'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'last',
    'lately', 'later', 'latter', 'latterly', 'less', 'lest', 'let\'s', 'liked', 'little', 'look', 'looking', 'looks', 'ltd', 'mainly', 'many', 'maybe', 'mean', 'meanwhile',
    'merely', 'more', 'moreover', 'mostly', 'much', 'mustn\'t', 'myself', 'name', 'namely', 'nd', 'near', 'nearly', 'necessary', 'need', 'needs', 'never', 'nevertheless',
    'new', 'next', 'nine', 'nobody', 'non', 'none', 'noone', 'normally', 'nothing', 'novel', 'now', 'nowhere', 'obviously', 'oh', 'ok', 'okay', 'old', 'once', 'one', 'ones',
    'onto', 'others', 'otherwise', 'ought', 'ours', 'ourselves', 'out', 'outside', 'over', 'overall', 'particular', 'particularly', 'per', 'perhaps', 'placed', 'please',
    'plus', 'possible', 'presumably', 'probably', 'provides', 'que', 'quite', 'qv', 'rd', 're', 'really', 'reasonably', 'regarding', 'regardless', 'regards', 'relatively',
    'respectively', 'right', 's', 'same', 'saw', 'saying', 'second', 'secondly', 'see', 'seeing', 'seem', 'seemed', 'seeming', 'seems', 'seen', 'self', 'selves', 'sensible',
    'sent', 'serious', 'seriously', 'seven', 'several', 'shall', 'shan\'t', 'she\'d', 'she\'ll', 'she\'s', 'shouldn\'t', 'six', 'somebody', 'somehow', 'someone', 'something',
    'sometime', 'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry', 'specified', 'specify', 'specifying', 'still', 'sub', 'such', 'sup', 'sure', 't', 'take', 'taken', 'tell',
    'tends', 'th', 'thank', 'thanks', 'thanx', 'thats', 'that\'s', 'theirs', 'themselves', 'thence', 'thereafter', 'thereby', 'therefore', 'therein', 'theres', 'there\'s', 'thereupon',
    'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'think', 'third', 'thorough', 'thoroughly', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'together', 'took',
    'toward', 'towards', 'tried', 'tries', 'truly', 'try', 'trying', 't\'s', 'twice', 'two', 'un', 'under', 'unfortunately', 'unless', 'unlikely', 'until', 'unto', 'up', 'upon', 'use',
    'used', 'useful', 'uses', 'using', 'usually', 'value', 'various', 'very', 'via', 'viz', 'vs', 'want', 'wasn\'t', 'way', 'we\'d', 'welcome', 'well', 'we\'ll', 'went', 'we\'re', 'weren\'t',
    'we\'ve', 'whatever', 'what\'s', 'whence', 'whenever', 'when\'s', 'whereafter', 'whereas', 'whereby', 'wherein', 'where\'s', 'whereupon', 'wherever', 'whether', 'whither', 'whoever', 'whole',
    'who\'s', 'whose', 'why\'s', 'willing', 'wish', 'within', 'without', 'wonder', 'won\'t', 'wouldn\'t', 'yes', 'you\'d', 'you\'ll', 'your', 'you\'re', 'yours', 'yourself', 'yourselves', 'you\'ve', 'zero'];

const WORDS_TO_ADD =['dear', 'tis', 'twas'];

/**
 * stop words
 */
class StopWords {
    /**
     * Method to remove stop words from the keywords send in the parameter
     * @param keywords
     * @returns {Promise<*>}
     */
    static async removeStopWords(keywords) {
        stopwords.remove(WORDS_TO_REMOVE);
        stopwords.add(WORDS_TO_ADD);
        return await stopwords.cleanText(keywords);
    }
}

module.exports = StopWords;
