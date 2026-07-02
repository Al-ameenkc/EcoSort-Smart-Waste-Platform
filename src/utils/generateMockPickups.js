import { getServiceAreaNames } from '../constants/serviceAreas';

const TEST_CUSTOMER = 'Al Ameen Mustapha kachalla';

const HAUSA_FIRST = [
  'Musa', 'Ibrahim', 'Abubakar', 'Sani', 'Yusuf', 'Ahmed', 'Aliyu', 'Kabiru',
  'Haruna', 'Suleiman', 'Bello', 'Nasiru', 'Umar', 'Aminu', 'Garba', 'Lawal',
  'Fatima', 'Aisha', 'Zainab', 'Hauwa', 'Hadiza', 'Maryam', 'Khadija', 'Halima',
  'Bilkisu', 'Rukayya', 'Tijjani', 'Bala', 'Hamza', 'Faruk', 'Bashir', 'Nuhu',
];

const HAUSA_LAST = [
  'Ibrahim', 'Musa', 'Bello', 'Abdullahi', 'Mohammed', 'Sani', 'Garba', 'Lawal',
  'Aliyu', 'Umar', 'Danjuma', 'Isa', 'Sule', 'Tanko', 'Waziri', 'Yakubu',
  'Shehu', 'Inuwa', 'Dauda', 'Adamu', 'Salisu', 'Maikudi', 'Jibrin', 'Zubairu',
];

const OTHER_NIGERIAN_NAMES = [
  'Chinedu Okafor',
  'Adebayo Adeyemi',
  'Ngozi Eze',
];

const WASTE_TYPES = [
  'Plastic Bottles (PET)',
  'Plastic Bottles (PET)',
  'Plastic Bottles (PET)',
  'Cartons / Paper',
  'Cans / Metals',
  'Mixed Recyclables',
];

const STREET_HINTS = [
  'Close 12',
  'Estate Gate',
  'Market Road',
  'Junction',
  'Block C Flat 4',
  'Sunnyvale Street',
  'Behind Mosque',
  'Shop 7 Plaza',
  'Phase 2',
  'Unity Avenue',
];

const STATUSES = ['Pending', 'Assigned', 'Completed'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomPhone = () => {
  const prefix = pick(['0803', '0806', '0703', '0810', '0903', '0913']);
  const tail = String(Math.floor(1000000 + Math.random() * 9000000));
  return `${prefix} ${tail.slice(0, 3)} ${tail.slice(3)}`;
};

const randomDateInRange = (rangeStart, rangeEnd) => {
  const start = rangeStart.getTime();
  const end = rangeEnd.getTime();
  if (end <= start) return new Date(start);
  const hour = 8 + Math.floor(Math.random() * 11);
  const minute = Math.floor(Math.random() * 60);
  const date = new Date(start + Math.random() * (end - start));
  date.setHours(hour, minute, 0, 0);
  if (date > rangeEnd) return new Date(rangeEnd);
  if (date < rangeStart) return new Date(rangeStart);
  return date;
};

const buildAddress = (zone) => {
  const hint = pick(STREET_HINTS);
  return `${hint}, ${zone}, Abuja`;
};

const monthlyCounts = (total, numMonths) => {
  if (numMonths <= 0) return [];
  const counts = Array.from({ length: numMonths }, (_, i) => i + 1);
  let sum = counts.reduce((a, b) => a + b, 0);
  let remaining = total - sum;

  for (let i = numMonths - 1; i >= 0 && remaining > 0; i -= 1) {
    const add = Math.min(remaining, Math.max(1, Math.ceil(remaining / (i + 1))));
    counts[i] += add;
    remaining -= add;
  }

  while (remaining > 0) {
    counts[numMonths - 1] += 1;
    remaining -= 1;
  }

  return counts;
};

const buildNamePool = (count) => {
  const pool = Array.from({ length: count }, () => `${pick(HAUSA_FIRST)} ${pick(HAUSA_LAST)}`);
  const otherCount = Math.min(OTHER_NIGERIAN_NAMES.length, Math.max(1, Math.floor(count * 0.06)));
  const usedPositions = new Set();

  for (let i = 0; i < otherCount; i += 1) {
    let pos;
    do {
      pos = Math.floor(Math.random() * count);
    } while (usedPositions.has(pos));
    usedPositions.add(pos);
    pool[pos] = OTHER_NIGERIAN_NAMES[i % OTHER_NIGERIAN_NAMES.length];
  }

  return pool;
};

const listMonthsInRange = (startDate, endDate) => {
  const months = [];
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (cursor <= end) {
    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59, 999);
    months.push({
      rangeStart: monthStart < startDate ? startDate : monthStart,
      rangeEnd: monthEnd > endDate ? endDate : monthEnd,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
};

/**
 * Generates mock pickup orders with increasing monthly volume.
 * The 5 earliest orders are attributed to Al Ameen Mustapha kachalla (testing).
 */
export const generateMockPickups = ({
  total = 30,
  maxTotal = 30,
  startDate = new Date(2026, 0, 12),
  endDate = new Date(),
  includePhone = false,
} = {}) => {
  const cappedTotal = Math.min(maxTotal, Math.max(1, total));
  const months = listMonthsInRange(startDate, endDate);
  const counts = monthlyCounts(cappedTotal, months.length);
  const zones = getServiceAreaNames();
  const namePool = buildNamePool(cappedTotal);
  let nameIdx = 0;

  const orders = [];

  months.forEach(({ rangeStart, rangeEnd }, monthIndex) => {
    const count = counts[monthIndex] || 0;
    for (let i = 0; i < count; i += 1) {
      const zone = pick(zones);
      const createdAt = randomDateInRange(rangeStart, rangeEnd);

      const order = {
        id: `mock-${orders.length + 1}`,
        fullName: namePool[nameIdx++] || `${pick(HAUSA_FIRST)} ${pick(HAUSA_LAST)}`,
        wasteType: pick(WASTE_TYPES),
        address: buildAddress(zone),
        zone,
        status: pick(STATUSES),
        createdAt: { toDate: () => createdAt },
      };

      if (includePhone) {
        order.phone = randomPhone();
      }

      orders.push(order);
    }
  });

  orders.sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate());

  for (let i = 0; i < Math.min(5, orders.length); i += 1) {
    orders[i].fullName = TEST_CUSTOMER;
    orders[i].status = 'Pending';
    if (includePhone) {
      orders[i].phone = '0808 021 0809';
    } else {
      delete orders[i].phone;
    }
  }

  return orders.slice(0, cappedTotal);
};
