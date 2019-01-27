import axios from 'axios';
import { proxy, key, host } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    };

    async getResults() {
        try {
            const res = await axios(`${proxy}${host}/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}

/**
 * food2fork.com
 * 
 * Token: 064a2afdd5f5190c5cae855c069f9a8e
 * 
 * API for search: https://www.food2fork.com/api/search
 * key: API Key
 * q: (optional) Search Query (Ingredients should be separated by commas). If this is omitted top rated recipes will be returned.
 * sort: (optional) How the results should be sorted. See Below for details.
 * page: (optional) Used to get additional results
 * 
 * API for get https://www.food2fork.com/api/get 
 * key: API Key
 * rId: Id of desired recipe as returned by Search Query
 *  */