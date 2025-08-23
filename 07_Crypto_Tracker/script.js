let allCoins = [];
let currentCurrency = localStorage.getItem('currentCurrency') || 'inr';
let currencyList = [];
const currencySymbols = {
    inr: '₹',
    usd: '$',
    eur: '€',
    gbp: '£',
    jpy: '¥',
    aud: 'A$',
    cad: 'C$',
    chf: 'CHF',
    cny: '¥',
    hkd: 'HK$',
    nzd: 'NZ$'
};

function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
        theme = 'light';
    }

    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
    const toggleButton = document.getElementById('theme-toggle');
    toggleButton.innerHTML = theme === 'light'
        ? `<svg class="sun-icon" viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM3.293 3.293a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414L3.293 4.707a1 1 0 0 1 0-1.414zm16 16a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414zM6 12a1 1 0 0 1-1-1H3a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1zm16 0a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1 1zM4.707 17.293a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zm16-1.414a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414zM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/></svg>`
        : `<svg class="moon-icon" viewBox="0 0 24 24"><path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .6-2.94 1 1 0 0 0-1.3-1.18A10 10 0 0 0 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10a9.91 9.91 0 0 0-0.36-2.86z"/></svg>`;
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

async function fetchWithRetry(url, retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Fetching: ${url}`);
            const response = await fetch(url);
            if (response.status === 429) {
                console.warn(`Rate limit hit for ${url}, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) {
                throw error;
            }
            console.warn(`Fetch attempt ${i + 1} failed for ${url}: ${error.message}, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}


async function fetchSupportedCurrencies() {
    const cachedCurrencies = localStorage.getItem('supportedCurrencies');
    if (cachedCurrencies) {
        console.log('Using cached currencies');
        currencyList = JSON.parse(cachedCurrencies);
        if (!currencyList.includes(currentCurrency)) {
            currentCurrency = 'inr';
            localStorage.setItem('currentCurrency', currentCurrency);
        }
        populateCurrencyDropdown();
        return;
    }
    const url = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies';
    const errorDiv = document.getElementById('error');
    try {
        const response = await fetchWithRetry(url);
        currencyList = await response.json();
        console.log('Supported currencies fetched', currencyList);
        localStorage.setItem('supportedCurrencies', JSON.stringify(currencyList));
        if (!currencyList.includes(currentCurrency)) {
            currentCurrency  = 'inr';
            localStorage.setItem('currentCurrency', currentCurrency);
        }
        populateCurrencyDropdown();
    } catch (error) {
        errorDiv.textContent = `Error fetching currencies: ${error.message}. Using fallback currencies`;
        errorDiv.style.display = 'block';
        console.error('Currency fetch error:', error);
        currencyList = ['usd', 'eur', 'gbp', 'jpy'];
        if (!currencyList.includes(currentCurrency)) {
            currentCurrency = 'inr';
            localStorage.setItem('currentCurrency', currentCurrency);
        }
        populateCurrencyDropdown();
    }
}

function populateCurrencyDropdown() {
    const currencySelect = document.getElementById('currency-select');
    currencySelect.innerHTML = '';

    currencyList.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency.toUpperCase();
        if (currency === currentCurrency) {
            option.selected = true;
        }
        currencySelect.appendChild(option);
    })
}

async function fetchCryptoData(currency) {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false`;
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const cryptoData = document.getElementById('crypto-data');
    const noCryptoResults = document.getElementById('no-crypto-results');

    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        noCryptoResults.style.display = 'none';

        const response = await fetchWithRetry(url);
        const data = await response.json();
        console.log(`Crypto data fetched for ${currency}: `, data);

        allCoins = data;
        requestAnimationFrame(()=> filterCryptoCoins());
    } catch (error) {
        errorDiv.textContent = `Error fetching data: ${error.message}. Showing last available data.`;
        errorDiv.style.display = 'block';
        if (allCoins.length > 0) {
            requestAnimationFrame(()=> filterCryptoCoins());
        }
    } finally {
        loading.style.display = 'none';
    }
}

function renderCoins(coins) {
    const cryptoData = document.getElementById('crypto-data');
    const noCryptoResults = document.getElementById('no-crypto-results');
    const currencySymbol = currencySymbols[currentCurrency] || currentCurrency.toUpperCase();
    cryptoData.innerHTML = '';

    if (coins.length === 0) {
        noCryptoResults.style.display = 'block';
        return;
    }
    noCryptoResults.style.display = 'none';

    const priceHeader = document.querySelector('#crypto-table th:nth-child(3)');
    const marketCapHeader = document.querySelector('#crypto-table th:nth-child(4)');
    priceHeader.textContent = `Price (${currentCurrency.toUpperCase()})`;
    marketCapHeader.textContent = `Market Cap (${currentCurrency.toUpperCase()})`;

    coins.forEach(coin => {
        const row = document.createElement('tr');
        const price = coin.current_price != null ? `${currencySymbol}${coin.current_price.toFixed(2)}` : 'N/A';
        const marketCap = coin.market_cap != null ? `${currencySymbol}${coin.market_cap.toLocaleString()}` : 'N/A';
        const priceChange = coin.price_change_percentage_24h != null
            ? `${coin.price_change_percentage_24h.toFixed(2)}%`
            : 'N/A';
        const changeClass = coin.price_change_percentage_24h != null && coin.price_change_percentage_24h >= 0
        ? 'positive'
        : coin.price_change_percentage_24h != null
            ? 'negative'
            : '';

        row.innerHTML = `
                    <td>${coin.name || 'N/A'}</td>
                    <td>${coin.symbol ? coin.symbol.toUpperCase() : 'N/A'}</td>
                    <td>${price}</td>
                    <td>${marketCap}</td>
                    <td class="${changeClass}">${priceChange}</td>
                `;
        cryptoData.appendChild(row);
    });
}

function filterCryptoCoins() {
    const searchTerm = document.getElementById('crypto-search-input').value.toLowerCase();
    const filteredCoins = allCoins.filter(coin => 
        (coin.name && coin.name.toLowerCase().includes(searchTerm)) ||
        (coin.symbol && coin.symbol.toLowerCase().includes(searchTerm))
    );
    renderCoins(filteredCoins);
}

function handleCurrencyChange() {
    const newCurrency = document.getElementById('currency-select').value;
    if (newCurrency !== currentCurrency) {
        currentCurrency = newCurrency;
        localStorage.setItem('currentCurrency', currentCurrency);
        fetchCryptoData(currentCurrency);
    }
}

let isTogglingTheme = false;
function toggleTheme() {
    if (isTogglingTheme) return; 
    isTogglingTheme = true;
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
    setTimeout(() => {
        isTogglingTheme = false;
    }, 300);
}

let isInitializing = false;
async function init() {
    if (isInitializing) return; 
    isInitializing = true;
    try {
        const savedSearch = localStorage.getItem('cryptoSearchTerm') || '';
        document.getElementById('crypto-search-input').value = savedSearch;

        await fetchSupportedCurrencies();
        await fetchCryptoData(currentCurrency);
        setInterval(() => {
            fetchCryptoData(currentCurrency)
        }, 60000);
    } finally {
        isInitializing = false;
    }
}

document.getElementById('crypto-search-input').addEventListener('input', (event) => {
    localStorage.setItem('cryptoSearchTerm', event.target.value);
    filterCryptoCoins();
});
document.getElementById('currency-select').addEventListener('change', handleCurrencyChange);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

init();
