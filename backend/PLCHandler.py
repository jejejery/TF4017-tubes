from fins import FinsClient


class PLCHandler:
    def __init__(self, host: str, port: int):
        """
        Inisialisasi koneksi ke PLC menggunakan protokol FINS.

        Args:
            host (str): IP address PLC.
            port (int): Port untuk komunikasi (default: 9600 untuk Omron PLC).
        """
        self.host = host
        self.port = port
        self.client = None

    def connect(self):
        """Membuat koneksi ke PLC."""
        try:
            self.client = FinsClient(host=self.host, port=self.port)
            self.client.connect()
            print(f"Connected to PLC at {self.host}:{self.port}")
        except Exception as e:
            print(f"Error connecting to PLC: {e}")
            self.client = None

    def disconnect(self):
        """Menutup koneksi ke PLC."""
        if self.client:
            self.client.close()
            self.client = None
            print("Disconnected from PLC.")

    def read_memory_area(self, address: str) -> str:
        """
        Membaca data dari alamat memori PLC.

        Args:
            address (str): Alamat memori (contoh: 'D1', 'D20').

        Returns:
            str: Data yang dibaca dalam format hex.
        """
        if not self.client:
            raise ConnectionError("Not connected to PLC. Call connect() first.")
        try:
            response = self.client.memory_area_read(address)
            return response.data.hex()
        except Exception as e:
            print(f"Error reading memory area {address}: {e}")
            return None

    def read_parameter(self, parameter: str) -> str:
        """
        Membaca parameter berdasarkan nama parameter yang telah dikonfigurasi.

        Args:
            parameter (str): Nama parameter (misalnya: 'temperature', 'hysteresis').

        Returns:
            str: Data dari alamat parameter dalam format hex.
        """
        parameter_map = {
            "panas": "D1",
            "dingin": "D2",
            "hysteresis": "D20",
            # Tambahkan parameter lainnya di sini
        }
        address = parameter_map.get(parameter)
        if not address:
            raise ValueError(f"Parameter '{parameter}' tidak ditemukan.")
        return self.read_memory_area(address)
    

# Contoh Penggunaan
if __name__ == "__main__":
    # Inisialisasi handler untuk PLC
    plc = PLCHandler(host="192.168.250.1", port=9600)

    # Koneksi ke PLC
    plc.connect()

    # Membaca parameter
    try:
        temperature_data = plc.read_parameter("panas")
        print(f"Temperature panas(D1): {temperature_data}")

        hysteresis_data = plc.read_parameter("hysteresis")
        print(f"Hysteresis (D20): {hysteresis_data}")
    finally:
        # Pastikan koneksi ditutup
        plc.disconnect()