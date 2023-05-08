import unittest
from unittest.mock import patch
from collections import defaultdict

from your_module import collect_data, get_product_detail

class TestYourModule(unittest.TestCase):

    def test_collect_data(self):
        origin = [
            {
                "data": {
                    "render_obj": [
                        {
                            "type": "title",
                            "content": "예약확정",
                        },
                        {
                            "type": "item",
                            "content": "Booking confirmed",
                        },
                    ]
                }
            }
        ]
        result = defaultdict(list)
        expected = {
            "confirm_booking": ["Booking confirmed"],
        }
        self.assertEqual(collect_data(origin, result), expected)

    @patch("your_module.requests.get")
    @patch("your_module.BeautifulSoup")
    @patch("your_module.create_directory")
    @patch("your_module.open")
    def test_get_product_detail(self, mock_open, mock_create_directory, mock_beautiful_soup, mock_requests_get):
        # Prepare mock data and responses
        mock_resp = unittest.mock.Mock()
        mock_resp.json.return_value = {"success": True, "result": {}}
        mock_requests_get.return_value = mock_resp

        mock_html_data = unittest.mock.Mock()
        mock_html_data.body = unittest.mock.Mock()
        mock_beautiful_soup.return_value = mock_html_data

        data = {
            "id": "1",
            "name": "Test Product",
            "url": "https://example.com/product/1",
            "city_name": "Seoul",
            "tags": [],
        }

        get_product_detail(data)

        # Assert that necessary functions have been called
        mock_create_directory.assert_called_once()
        mock_requests_get.assert_called()
        mock_open.assert_called()

if __name__ == "__main__":
    unittest.main()
