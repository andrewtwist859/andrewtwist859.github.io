from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service
import csv
import time

# Configure Selenium
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Optional: Remove this if you want to see the browser
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# Ensure correct path to ChromeDriver
driver_path = 'chromedriver'  # Use full path if not in the same directory
service = Service(driver_path)
driver = webdriver.Chrome(service=service, options=options)

driver.get('https://www.sheffield.ac.uk/postgraduate/phd/projects')  # URL to scrape

wait = WebDriverWait(driver, 10)
data = []

def extract_data_from_listing(listing):
    try:
        # Extract data from the current listing
        phd_title = listing.find_element(By.CLASS_NAME, 'title').text
        department = listing.find_element(By.CLASS_NAME, 'department').text
        details_link = listing.find_element(By.TAG_NAME, 'a').get_attribute('href')

        # Click "View Details" link if available and extract additional info
        driver.execute_script("arguments[0].click();", listing)
        time.sleep(2)
        
        # Parse the expanded content
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        full_details = soup.find('div', class_='details').text

        data.append({
            "PhD Title": phd_title,
            "Department": department,
            "Details Link": details_link,
            "Full Details": full_details
        })

    except Exception as e:
        print("Error:", e)

def extract_data_from_page():
    listings = driver.find_elements(By.CLASS_NAME, 'listing')  # Update this if necessary
    for listing in listings:
        extract_data_from_listing(listing)

# Loop through pages to capture multiple listings
page_count = 0
while page_count < 3:  # Adjust as needed for testing more pages
    extract_data_from_page()
    page_count += 1
    try:
        next_button = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, 'Next')))
        next_button.click()
        time.sleep(3)
    except Exception as e:
        print("No more pages or error:", e)
        break

driver.quit()

# Save to CSV
csv_file = 'phd_listings_sheffield.csv'
keys = data[0].keys()

with open(csv_file, 'w', newline='', encoding='utf-8') as f:
    dict_writer = csv.DictWriter(f, fieldnames=keys)
    dict_writer.writeheader()
    dict_writer.writerows(data)

print(f"Saved {len(data)} PhD listings to {csv_file}")

