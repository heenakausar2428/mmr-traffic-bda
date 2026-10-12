import hashlib

class BloomFilter:
    """
    Bloom Filter implementation for Mumbai Traffic Intelligence.
    Used for space-efficient O(1) duplicate event detection on traffic streams.
    """
    def __init__(self, size=10000, hash_count=3):
        self.size = size
        self.hash_count = hash_count
        self.bit_array = [0] * size
        self.inserted_count = 0
        self.duplicate_detected_count = 0
        self.hashes_used = ["md5", "sha256", "crc32"]

    def _get_hashes(self, item: str):
        hashes = []
        item_bytes = item.encode('utf-8')
        
        # Hash 1: MD5
        h1 = int(hashlib.md5(item_bytes).hexdigest(), 16) % self.size
        hashes.append(h1)
        
        # Hash 2: SHA256
        h2 = int(hashlib.sha256(item_bytes).hexdigest(), 16) % self.size
        hashes.append(h2)
        
        # Hash 3: Murmur/FNV style hash derived from sha1
        h3 = int(hashlib.sha1(item_bytes).hexdigest(), 16) % self.size
        hashes.append(h3)
        
        return hashes[:self.hash_count]

    def add(self, item: str) -> bool:
        """
        Add item to Bloom Filter. Returns True if item was ALREADY present (possible duplicate),
        False if new item inserted.
        """
        hashes = self._get_hashes(item)
        already_present = all(self.bit_array[h] == 1 for h in hashes)
        
        for h in hashes:
            self.bit_array[h] = 1
            
        if already_present:
            self.duplicate_detected_count += 1
        else:
            self.inserted_count += 1
            
        return already_present

    def check(self, item: str) -> bool:
        hashes = self._get_hashes(item)
        return all(self.bit_array[h] == 1 for h in hashes)

    def get_stats(self):
        bits_set = sum(self.bit_array)
        fill_ratio = round((bits_set / self.size) * 100, 2)
        # Approximate false positive probability formula: (1 - e^(-kn/m))^k
        import math
        k = self.hash_count
        n = self.inserted_count
        m = self.size
        fp_rate = (1 - math.exp(-k * n / m)) ** k if m > 0 else 0.0

        # Sample bit array (first 100 bits for visual rendering)
        sample_bits = self.bit_array[:100]

        return {
            "filter_size": self.size,
            "hash_functions": self.hash_count,
            "bits_set": bits_set,
            "fill_ratio_percent": fill_ratio,
            "total_events_processed": self.inserted_count + self.duplicate_detected_count,
            "unique_events_inserted": self.inserted_count,
            "possible_duplicates_detected": self.duplicate_detected_count,
            "estimated_false_positive_rate": round(fp_rate * 100, 4),
            "sample_bit_array": sample_bits,
            "status": "Active"
        }
