onmessage = (event) => {
  const { msg, data } = event.data;

  if (msg === "generate") {
    generateYearObject(data);
  }
  if (msg === "write") {
    writeFile(data);
  }
  if (msg === "read") {
    readFile();
  }
};

async function readFile() {
  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle("shiftCalculator3.txt");
    const file = await fileHandle.getFile();
    const existingData = await file.text();
    postMessage({ msg: "read", data: JSON.parse(existingData) });
  } catch {
    postMessage({ msg: "error", data: "error" });
  }
}

async function writeFile(data) {
  const root = await navigator.storage.getDirectory();
  const draftHandle = await root.getFileHandle("shiftCalculator3.txt", {
    create: true,
  });
  const accessHandle = await draftHandle.createSyncAccessHandle();
  await accessHandle.truncate(0);
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(data);
  const writeBuffer = accessHandle.write(encodedMessage, { at: 0 });
  accessHandle.flush();
  accessHandle.close();
  postMessage({ msg: "write", data: JSON.parse(data) });
}

function generateYearObject(data) {
  const { years, startMonth, startDay, pattern, referenceYear } = data;
  const yearObject = {};
  let dayToAdd = 0;

  for (let currentYear = referenceYear; currentYear <= years; currentYear++) {
    for (let month = 1; month <= 12; month++) {
      yearObject[currentYear] = yearObject[currentYear] || {};
      yearObject[currentYear][month] = yearObject[currentYear][month] || {};
      const daysInMonth = new Date(currentYear, month, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        if (
          currentYear < referenceYear ||
          (currentYear === referenceYear && month < startMonth) ||
          (currentYear === referenceYear &&
            month === startMonth &&
            day < startDay)
        ) {
          yearObject[currentYear][month][day] = null;
        } else {
          yearObject[currentYear][month][day] = pattern[dayToAdd];
          dayToAdd = (dayToAdd + 1) % pattern.length;
        }
      }
    }
  }
  postMessage({ msg: "generate", data: yearObject });
}
