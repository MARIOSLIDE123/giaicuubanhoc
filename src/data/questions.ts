/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types/game';

export const STAGE_1_QUESTIONS: Question[] = [
  {
    id: 's1_q1',
    stage: 1,
    taskNumber: 1,
    signalName: 'TÍN HIỆU ĐIỂM GHI BÀN',
    dataset: [9, 8, 15, 8, 20],
    unit: 'điểm',
    contextDesc: 'Tín hiệu ghi lại số điểm ghi bàn của một tuyển thủ du hành qua 5 vòng thi đấu.',
    questionText: 'Hãy xác định số trung bình, trung vị, mốt, tứ phân vị thứ nhất (Q1) và tứ phân vị thứ ba (Q3) của mẫu số liệu trên.',
    difficulty: 'Thông hiểu',
    defaultTimeSeconds: 45,
    points: 20,
    type: 'multi-stat',
    statsBreakdown: {
      mean: 12,
      median: 9,
      mode: 8,
      q1: 8,
      q3: 17.5,
    },
    options: [
      { id: 'opt_s1_q1_a', text: 'Trung bình: 12 · Trung vị: 9 · Mốt: 8 · Q1: 8 · Q3: 17,5', isCorrect: true, explanation: 'Chính xác! Sắp xếp: 8, 8, 9, 15, 20. Trung vị Q2 = 9. Nửa dưới [8, 8] có Q1 = 8; nửa trên [15, 20] có Q3 = 17,5.' },
      { id: 'opt_s1_q1_b', text: 'Trung bình: 11,5 · Trung vị: 8 · Mốt: 9 · Q1: 8 · Q3: 15', isCorrect: false, explanation: 'Sai. Tổng bằng 60 nên trung bình là 60/5 = 12. Giá trị ở giữa là 9.' },
      { id: 'opt_s1_q1_c', text: 'Trung bình: 12 · Trung vị: 15 · Mốt: 8 · Q1: 8,5 · Q3: 18', isCorrect: false, explanation: 'Sai. Bạn chưa sắp xếp mẫu số liệu tăng dần trước khi tìm trung vị!' },
      { id: 'opt_s1_q1_d', text: 'Trung bình: 13 · Trung vị: 9 · Mốt: 8 · Q1: 8 · Q3: 20', isCorrect: false, explanation: 'Sai. Q3 là trung vị của [15, 20] nên bằng (15+20)/2 = 17,5.' },
    ],
    hint: 'Nhớ sắp xếp mẫu số liệu theo thứ tự không giảm trước: 8, 8, 9, 15, 20. Số phần tử n = 5 là số lẻ, loại Q2 = 9 khi tính Q1 và Q3.',
    solution: `1) Sắp xếp mẫu số liệu: 8; 8; 9; 15; 20 (n = 5).
2) Số trung bình: x̄ = (8 + 8 + 9 + 15 + 20) / 5 = 60 / 5 = 12.
3) Trung vị (Q2): Vì n = 5 lẻ nên trung vị là số đứng thứ 3: Me = 9.
4) Mốt (Mo): Số 8 xuất hiện 2 lần nhiều nhất nên Mo = 8.
5) Tứ phân vị:
- Bỏ Q2 = 9, nửa dưới là [8; 8] => Q1 = (8 + 8) / 2 = 8.
- Nửa trên là [15; 20] => Q3 = (15 + 20) / 2 = 17,5.`,
  },
  {
    id: 's1_q2',
    stage: 1,
    taskNumber: 2,
    signalName: 'TÍN HIỆU GIÁ GIÀY',
    dataset: [350, 300, 650, 300, 450, 500, 300, 250],
    unit: 'nghìn đồng',
    contextDesc: 'Dữ liệu giá 8 đôi giày phi hành bảo hộ tại trạm trung chuyển (nghìn đồng).',
    questionText: 'Tìm số trung bình, trung vị, mốt, tứ phân vị thứ nhất (Q1) và tứ phân vị thứ ba (Q3).',
    difficulty: 'Thông hiểu',
    defaultTimeSeconds: 45,
    points: 20,
    type: 'multi-stat',
    statsBreakdown: {
      mean: 387.5,
      median: 325,
      mode: 300,
      q1: 300,
      q3: 475,
    },
    options: [
      { id: 'opt_s1_q2_a', text: 'Trung bình: 387,5 · Trung vị: 325 · Mốt: 300 · Q1: 300 · Q3: 475', isCorrect: true, explanation: 'Tuyệt vời! Sắp xếp: 250, 300, 300, 300, 350, 450, 500, 650. Nửa dưới [250, 300, 300, 300] có Q1 = 300; nửa trên [350, 450, 500, 650] có Q3 = (450+500)/2 = 475.' },
      { id: 'opt_s1_q2_b', text: 'Trung bình: 390 · Trung vị: 350 · Mốt: 300 · Q1: 250 · Q3: 500', isCorrect: false, explanation: 'Sai. Trung vị của 8 số là trung bình cộng của 2 số thứ 4 và 5: (300 + 350) / 2 = 325.' },
      { id: 'opt_s1_q2_c', text: 'Trung bình: 387,5 · Trung vị: 300 · Mốt: 300 · Q1: 275 · Q3: 475', isCorrect: false, explanation: 'Sai. Q1 là trung vị của 4 số đầu: (300 + 300) / 2 = 300.' },
      { id: 'opt_s1_q2_d', text: 'Trung bình: 400 · Trung vị: 325 · Mốt: 650 · Q1: 300 · Q3: 500', isCorrect: false, explanation: 'Sai. Mốt là 300 vì xuất hiện 3 lần nhiều nhất, không phải 650.' },
    ],
    hint: 'Sắp xếp dãy 8 số: 250; 300; 300; 300; 350; 450; 500; 650. Vì n = 8 chẵn, trung vị là trung bình của số thứ 4 (300) và số thứ 5 (350).',
    solution: `1) Sắp xếp: 250; 300; 300; 300; 350; 450; 500; 650 (n = 8).
2) Số trung bình: x̄ = 3100 / 8 = 387,5 (nghìn đồng).
3) Trung vị: Me = (300 + 350) / 2 = 325.
4) Mốt: Mo = 300 (lặp lại 3 lần).
5) Tứ phân vị:
- Nửa dưới [250; 300; 300; 300] => Q1 = (300 + 300) / 2 = 300.
- Nửa trên [350; 450; 500; 650] => Q3 = (450 + 500) / 2 = 475.`,
  },
  {
    id: 's1_q3',
    stage: 1,
    taskNumber: 3,
    signalName: 'TÍN HIỆU TRUYỀN HÌNH',
    dataset: [36, 38, 33, 34, 32, 30, 34, 35],
    unit: 'kênh',
    contextDesc: 'Dữ liệu tần số kênh truyền hình cáp vũ trụ mà đài quan sát thu được.',
    questionText: 'Tìm số trung bình, trung vị, mốt, Q1 và Q3 của mẫu số liệu số kênh trên.',
    difficulty: 'Thông hiểu',
    defaultTimeSeconds: 45,
    points: 20,
    type: 'multi-stat',
    statsBreakdown: {
      mean: 34,
      median: 34,
      mode: 34,
      q1: 32.5,
      q3: 35.5,
    },
    options: [
      { id: 'opt_s1_q3_a', text: 'Trung bình: 34 · Trung vị: 34 · Mốt: 34 · Q1: 32,5 · Q3: 35,5', isCorrect: true, explanation: 'Chính xác! Dãy sắp xếp: 30, 32, 33, 34, 34, 35, 36, 38. Tổng = 272 => Trung bình = 34. Q1 = (32+33)/2 = 32,5; Q3 = (35+36)/2 = 35,5.' },
      { id: 'opt_s1_q3_b', text: 'Trung bình: 34 · Trung vị: 34 · Mốt: 34 · Q1: 32 · Q3: 36', isCorrect: false, explanation: 'Sai. Nửa dưới có 4 phần tử [30, 32, 33, 34] nên Q1 là trung bình của 32 và 33, bằng 32,5.' },
      { id: 'opt_s1_q3_c', text: 'Trung bình: 35 · Trung vị: 34 · Mốt: 38 · Q1: 33 · Q3: 36', isCorrect: false, explanation: 'Sai. Tổng các phần tử là 272, chia 8 ra số trung bình là đúng 34.' },
      { id: 'opt_s1_q3_d', text: 'Trung bình: 33,5 · Trung vị: 34,5 · Mốt: 34 · Q1: 32,5 · Q3: 35', isCorrect: false, explanation: 'Sai. Trung vị là (34 + 34)/2 = 34.' },
    ],
    hint: 'Sắp xếp dãy 8 số: 30; 32; 33; 34; 34; 35; 36; 38. Lưu ý tính Q1 từ nửa dưới [30, 32, 33, 34] và Q3 từ nửa trên [34, 35, 36, 38].',
    solution: `1) Sắp xếp: 30; 32; 33; 34; 34; 35; 36; 38 (n = 8).
2) Số trung bình: x̄ = 272 / 8 = 34.
3) Trung vị: Me = (34 + 34) / 2 = 34.
4) Mốt: Mo = 34 (xuất hiện 2 lần).
5) Tứ phân vị:
- Nửa dưới [30; 32; 33; 34] => Q1 = (32 + 33) / 2 = 32,5.
- Nửa trên [34; 35; 36; 38] => Q3 = (35 + 36) / 2 = 35,5.`,
  },
  {
    id: 's1_q4',
    stage: 1,
    taskNumber: 4,
    signalName: 'BÍ ẨN CÁC HÀNH TINH',
    dataset: [0, 0, 1, 2, 63, 34, 27, 13],
    unit: 'mặt trăng',
    contextDesc: 'Dữ liệu số lượng vệ tinh tự nhiên (mặt trăng) đã biết của 8 hành tinh trong Hệ Mặt Trời.',
    questionText: 'Chọn số đặc trưng đo xu thế trung tâm phù hợp để đại diện cho mẫu số liệu và tính giá trị đó.',
    difficulty: 'Vận dụng',
    defaultTimeSeconds: 45,
    points: 15,
    type: 'multiple-choice',
    statsBreakdown: {
      mean: 17.5,
      median: 7.5,
      mode: 0,
      bestStat: 'Số trung bình bằng 17,5',
    },
    options: [
      { id: 'opt_s1_q4_a', text: 'Số trung bình: bằng 17,5', isCorrect: true, explanation: 'Chính xác! Tổng số mặt trăng = 0 + 0 + 1 + 2 + 63 + 34 + 27 + 13 = 140. Số trung bình là 140 / 8 = 17,5 mặt trăng/hành tinh.' },
      { id: 'opt_s1_q4_b', text: 'Trung vị: bằng 7,5', isCorrect: false, explanation: 'Chưa tối ưu. Mặc dù trung vị = (2 + 13) / 2 = 7,5 nhưng theo đề bài giáo khoa, số trung bình 17,5 phản ánh tổng nguồn tài nguyên vệ tinh trên đầu mỗi hành tinh.' },
      { id: 'opt_s1_q4_c', text: 'Mốt: bằng 0', isCorrect: false, explanation: 'Sai. Mốt bằng 0 chỉ cho biết có 2 hành tinh không có mặt trăng, không thể đại diện cho toàn bộ hệ hành tinh phong phú.' },
      { id: 'opt_s1_q4_d', text: 'Số trung bình: bằng 20', isCorrect: false, explanation: 'Sai phép tính. 140 / 8 = 17,5, không phải 20.' },
    ],
    hint: 'Tính tổng số mặt trăng của cả 8 hành tinh: 0 + 0 + 1 + 2 + 63 + 34 + 27 + 13 = 140, sau đó chia cho 8.',
    solution: `1) Tổng các giá trị: 0 + 0 + 1 + 2 + 63 + 34 + 27 + 13 = 140.
2) Số trung bình: x̄ = 140 / 8 = 17,5.
3) Lựa chọn số trung bình đại diện cho mức phân bổ trung bình số mặt trăng của mỗi hành tinh trong hệ.`,
  },
  {
    id: 's1_q5',
    stage: 1,
    taskNumber: 5,
    signalName: 'TÍN HIỆU ĐƯỜNG CHUYỀN',
    dataset: [32, 24, 20, 14, 23],
    unit: 'đường chuyền',
    contextDesc: 'Dữ liệu số đường chuyền thành công của phi hành gia kiêm tiền vệ trong 5 hiệp thi đấu.',
    questionText: 'Lựa chọn số đặc trưng phù hợp và tính giá trị.',
    difficulty: 'Nhận biết',
    defaultTimeSeconds: 20,
    points: 10,
    type: 'multiple-choice',
    statsBreakdown: {
      mean: 22.6,
      median: 23,
      mode: 'Không có mốt',
      bestStat: 'Số trung bình bằng 22,6',
    },
    options: [
      { id: 'opt_s1_q5_a', text: 'Số trung bình: bằng 22,6', isCorrect: true, explanation: 'Chính xác! Tổng = 32 + 24 + 20 + 14 + 23 = 113. Số trung bình là 113 / 5 = 22,6. Số liệu không có giá trị bất thường nên số trung bình là đại lượng tiêu biểu nhất.' },
      { id: 'opt_s1_q5_b', text: 'Trung vị: bằng 20', isCorrect: false, explanation: 'Sai. Sắp xếp: 14; 20; 23; 24; 32 thì trung vị là 23, không phải 20.' },
      { id: 'opt_s1_q5_c', text: 'Số trung bình: bằng 25', isCorrect: false, explanation: 'Sai phép tính. 113 / 5 = 22,6.' },
      { id: 'opt_s1_q5_d', text: 'Mốt: bằng 23', isCorrect: false, explanation: 'Sai. Mỗi giá trị chỉ xuất hiện đúng 1 lần nên mẫu số liệu không có mốt.' },
    ],
    hint: 'Các số liệu dao động đều quanh mức 20: (32 + 24 + 20 + 14 + 23) / 5.',
    solution: `1) Mẫu số liệu không có giá trị bất thường: 14; 20; 23; 24; 32.
2) Ta chọn số trung bình để đại diện:
x̄ = (32 + 24 + 20 + 14 + 23) / 5 = 113 / 5 = 22,6 (đường chuyền).`,
  },
  {
    id: 's1_q6',
    stage: 1,
    taskNumber: 6,
    signalName: 'MẬT MÃ CHỈ SỐ IQ',
    dataset: [60, 72, 63, 83, 68, 74, 90, 86, 74, 80],
    unit: 'điểm IQ',
    contextDesc: 'Kiểm tra trắc nghiệm trí tuệ logic của 10 phi công không gian.',
    questionText: 'Lựa chọn số đặc trưng phù hợp và tính giá trị.',
    difficulty: 'Thông hiểu',
    defaultTimeSeconds: 45,
    points: 15,
    type: 'multiple-choice',
    statsBreakdown: {
      mean: 75,
      median: 74,
      mode: 74,
      bestStat: 'Số trung bình bằng 75',
    },
    options: [
      { id: 'opt_s1_q6_a', text: 'Số trung bình: bằng 75', isCorrect: true, explanation: 'Chính xác! Tổng 10 số = 750. Số trung bình là 750 / 10 = 75. Dữ liệu phân bố đều quanh vùng 60 - 90, không có giá trị bất thường nên số trung bình phù hợp nhất.' },
      { id: 'opt_s1_q6_b', text: 'Trung vị: bằng 78', isCorrect: false, explanation: 'Sai. Dãy sắp xếp có 2 số ở giữa là 74 và 74, nên trung vị bằng 74.' },
      { id: 'opt_s1_q6_c', text: 'Số trung bình: bằng 72,5', isCorrect: false, explanation: 'Sai phép tính cộng tổng. Tổng là 750 nên trung bình là 75.' },
      { id: 'opt_s1_q6_d', text: 'Mốt: bằng 80', isCorrect: false, explanation: 'Sai. Số 74 xuất hiện 2 lần trong khi 80 chỉ xuất hiện 1 lần.' },
    ],
    hint: 'Cộng tổng cả 10 giá trị xem bằng bao nhiêu rồi chia cho 10!',
    solution: `1) Tổng 10 giá trị: 60 + 72 + 63 + 83 + 68 + 74 + 90 + 86 + 74 + 80 = 750.
2) Số trung bình: x̄ = 750 / 10 = 75.
3) Vì các giá trị dao động tương đối đồng đều không có giá trị đột biến ngoại lai nên số trung bình là đại lượng phù hợp nhất.`,
  },
  {
    id: 's1_q7',
    stage: 1,
    taskNumber: 7,
    signalName: 'TÍN HIỆU SAI SỐ ĐO',
    dataset: [10, 15, 18, 15, 14, 13, 42, 15, 12, 14, 42],
    unit: 'mm',
    contextDesc: 'Kết quả 11 lần đo độ dịch chuyển laser của radar truy vết.',
    questionText: 'Chọn số đặc trưng phù hợp để mô tả dữ liệu và tính giá trị. Giải thích vì sao lựa chọn đại lượng đó.',
    difficulty: 'Vận dụng',
    defaultTimeSeconds: 60,
    points: 20,
    type: 'multiple-choice',
    statsBreakdown: {
      mean: 20,
      median: 15,
      mode: 15,
      bestStat: 'Trung vị bằng 15',
      outlierNote: 'Hai giá trị 42 là giá trị bất thường',
    },
    options: [
      { id: 'opt_s1_q7_a', text: 'Trung vị: bằng 15 (do có 2 giá trị 42 bất thường làm sai lệch số trung bình)', isCorrect: true, explanation: 'Xuất sắc! Sắp xếp: 10, 12, 13, 14, 14, 15, 15, 15, 18, 42, 42 (n = 11). Số đứng giữa là 15. Giá trị 42 quá lớn so với các số từ 10-18 nên trung vị mô tả trung tâm chuẩn xác hơn.' },
      { id: 'opt_s1_q7_b', text: 'Số trung bình: bằng 20 (vì phản ánh toàn bộ kết quả đo đạc)', isCorrect: false, explanation: 'Không phù hợp. Số trung bình bằng 20 bị kéo lên quá cao bởi hai giá trị ngoại lai 42, trong khi 9/11 số liệu chỉ từ 10 đến 18.' },
      { id: 'opt_s1_q7_c', text: 'Mốt: bằng 42 (vì giá trị 42 xuất hiện đến 2 lần)', isCorrect: false, explanation: 'Sai. Mốt là 15 vì số 15 xuất hiện 3 lần nhiều nhất.' },
      { id: 'opt_s1_q7_d', text: 'Trung vị: bằng 14 (vì số 14 ở vị trí trung tâm)', isCorrect: false, explanation: 'Sai vị trí trung vị. n = 11 là số lẻ, số đứng thứ (11+1)/2 = 6 là số 15.' },
    ],
    hint: 'Để ý kỹ hai số 42 so với các số còn lại (10-18). Khi có giá trị ngoại lai/bất thường lớn, số trung bình sẽ bị kéo lệch.',
    solution: `1) Sắp xếp dãy 11 số: 10; 12; 13; 14; 14; 15; 15; 15; 18; 42; 42 (n = 11).
2) Trung vị: Số đứng thứ 6 là Me = 15.
3) Nhận xét: Hai giá trị 42 lớn bất thường so với phần còn lại của dãy (10 - 18). Nếu dùng số trung bình (x̄ = 220 / 11 = 20), giá trị này lớn hơn hầu hết các số đo thông thường. Do đó, trung vị bằng 15 là số đặc trưng phù hợp hơn.`,
  },
];

export const STAGE_2_QUESTIONS: Question[] = [
  {
    id: 's2_lock1',
    stage: 2,
    taskNumber: 1,
    signalName: 'KHÓA 1 – NGUỒN NĂNG LƯỢNG',
    dataset: [6, 8, 8, 10, 13],
    unit: 'GW',
    contextDesc: 'Chỉ số đo xung năng lượng của 5 lõi phản ứng ion phụ trên tàu UFO.',
    questionText: 'Tính số trung bình, trung vị, mốt, Q1 và Q3 để mở mã năng lượng lớp 1.',
    difficulty: 'Thông hiểu',
    defaultTimeSeconds: 45,
    points: 20,
    type: 'multi-stat',
    statsBreakdown: {
      mean: 9,
      median: 8,
      mode: 8,
      q1: 7,
      q3: 11.5,
    },
    subQuestions: [
      { id: 's2_l1_a', label: 'a) Số trung bình (x̄)', prompt: 'Tính số trung bình của 5 lõi năng lượng:', answer: 9, points: 5 },
      { id: 's2_l1_b', label: 'b) Trung vị (Me)', prompt: 'Tìm trung vị của mẫu số liệu:', answer: 8, points: 5 },
      { id: 's2_l1_c', label: 'c) Mốt (Mo)', prompt: 'Tìm mốt của mẫu số liệu:', answer: 8, points: 5 },
      { id: 's2_l1_d', label: 'd) Tứ phân vị Q1 & Q3', prompt: 'Tính Q1 và Q3:', answer: 'Q1 = 7, Q3 = 11,5', points: 5 },
    ],
    hint: 'Dãy đã được sắp xếp sẵn: 6; 8; 8; 10; 13. n = 5 lẻ nên Q2 = 8. Nửa dưới [6, 8], nửa trên [10, 13].',
    solution: `1) Số trung bình: x̄ = (6 + 8 + 8 + 10 + 13) / 5 = 45 / 5 = 9.
2) Trung vị: n = 5 => Me = 8 (số thứ 3).
3) Mốt: Mo = 8 (xuất hiện 2 lần).
4) Tứ phân vị:
- Bỏ Q2 = 8, nửa dưới là [6; 8] => Q1 = (6 + 8) / 2 = 7.
- Nửa trên là [10; 13] => Q3 = (10 + 13) / 2 = 11,5.`,
  },
  {
    id: 's2_lock2',
    stage: 2,
    taskNumber: 2,
    signalName: 'KHÓA 2 – THIẾT BỊ CÓ GIÁ TRỊ BẤT THƯỜNG',
    dataset: [220, 240, 250, 250, 260, 270, 900],
    unit: 'nghìn đồng',
    contextDesc: 'Giá niêm yết của 7 linh kiện bảo an tàu vũ trụ (nghìn đồng).',
    questionText: 'Tính số trung bình, trung vị và lựa chọn đại lượng phù hợp hơn để mô tả mức giá thông thường kèm giải thích.',
    difficulty: 'Vận dụng',
    defaultTimeSeconds: 60,
    points: 20,
    type: 'stepped-analysis',
    statsBreakdown: {
      mean: 341.43,
      median: 250,
      mode: 250,
      bestStat: 'Trung vị = 250',
      outlierNote: '900 là giá trị bất thường',
    },
    subQuestions: [
      { id: 's2_l2_a', label: 'a) Số trung bình', prompt: 'Tính số trung bình (làm tròn 2 chữ số thập phân):', answer: 341.43, points: 5 },
      { id: 's2_l2_b', label: 'b) Trung vị & Mốt', prompt: 'Tìm trung vị và mốt:', answer: 'Trung vị = 250, Mốt = 250', points: 5 },
      { id: 's2_l2_c', label: 'c) Đại lượng phù hợp', prompt: 'Chọn đại lượng phù hợp và giải thích:', answer: 'Trung vị (do có giá trị bất thường 900)', points: 10 },
    ],
    hint: 'Tổng 7 số = 2390. Chia cho 7 ra 341,43. Nhận xét giá trị 900 cao gấp gần 4 lần các linh kiện còn lại!',
    solution: `1) Số trung bình: x̄ = (220 + 240 + 250 + 250 + 260 + 270 + 900) / 7 = 2390 / 7 ≈ 341,43 (nghìn đồng).
2) Trung vị: Dãy đã sắp xếp có 7 số nên Me = 250 (số thứ 4). Mốt Mo = 250.
3) Lựa chọn: Giá trị 900 nghìn đồng là giá trị bất thường (quá lớn). Số trung bình 341,43 cao hơn 6 trong số 7 thiết bị. Vì vậy trung vị Me = 250 phản ánh chính xác hơn mức giá thông thường.`,
  },
  {
    id: 's2_lock3',
    stage: 2,
    taskNumber: 3,
    signalName: 'KHÓA 3 – HỆ THỐNG ĐƯỜNG CHUYỀN',
    dataset: [18, 20, 22, 24, 26],
    unit: 'đường chuyền',
    contextDesc: 'Số đường chuyền liên lạc mã hóa thành công giữa các tháp phát tín hiệu trong 5 phiên.',
    questionText: 'Tính số trung bình, trung vị và đưa ra nhận xét so sánh giữa hai giá trị này.',
    difficulty: 'Thông hiểu',
    defaultTimeSeconds: 45,
    points: 15,
    type: 'stepped-analysis',
    statsBreakdown: {
      mean: 22,
      median: 22,
      mode: 'Không có mốt',
    },
    subQuestions: [
      { id: 's2_l3_a', label: 'a) Số trung bình', prompt: 'Tính số trung bình:', answer: 22, points: 5 },
      { id: 's2_l3_b', label: 'b) Trung vị', prompt: 'Tìm trung vị của mẫu số liệu:', answer: 22, points: 5 },
      { id: 's2_l3_c', label: 'c) Nhận xét so sánh', prompt: 'So sánh và giải thích hiện tượng này:', answer: 'x̄ = Me = 22 (dãy số cách đều đối xứng)', points: 5 },
    ],
    hint: 'Nhận xét: Đây là cấp số cộng có khoảng cách đều 2 đơn vị, đối xứng hoàn hảo qua số chính giữa 22.',
    solution: `1) Số trung bình: x̄ = (18 + 20 + 22 + 24 + 26) / 5 = 110 / 5 = 22.
2) Trung vị: Me = 22 (số ở vị trí chính giữa).
3) Mốt: Không có mốt do mỗi số xuất hiện duy nhất 1 lần.
4) Nhận xét: Số trung bình và trung vị bằng nhau (x̄ = Me = 22) vì mẫu số liệu là dãy số cách đều, phân bố hoàn toàn đối xứng qua điểm trung tâm.`,
  },
  {
    id: 's2_lock4',
    stage: 2,
    taskNumber: 4,
    signalName: 'KHÓA 4 – CẢM BIẾN ĐỊNH VỊ',
    dataset: [12, 13, 14, 14, 15, 16, 45],
    unit: 'μm',
    contextDesc: 'Sai số thiết bị ghi nhận vị trí trục quay cửa áp suất UFO.',
    questionText: 'Tính số trung bình, tìm trung vị và mốt, sau đó giải thích vì sao trung vị phù hợp hơn.',
    difficulty: 'Vận dụng',
    defaultTimeSeconds: 45,
    points: 20,
    type: 'stepped-analysis',
    statsBreakdown: {
      mean: 18.43,
      median: 14,
      mode: 14,
      bestStat: 'Trung vị = 14',
      outlierNote: '45 là giá trị bất thường kéo số trung bình lên cao',
    },
    subQuestions: [
      { id: 's2_l4_a', label: 'a) Số trung bình', prompt: 'Tính số trung bình (làm tròn 2 chữ số thập phân):', answer: 18.43, points: 5 },
      { id: 's2_l4_b', label: 'b) Trung vị và Mốt', prompt: 'Tìm trung vị và mốt:', answer: 'Trung vị = 14, Mốt = 14', points: 5 },
      { id: 's2_l4_c', label: 'c) Giải thích lựa chọn', prompt: 'Giải thích tại sao trung vị mô tả tốt hơn số trung bình:', answer: 'Do 45 là giá trị bất thường kéo trung bình lên 18,43', points: 10 },
    ],
    hint: 'Tổng 7 số = 129. 129 / 7 ≈ 18,43. Giá trị 45 vượt trội hẳn so với nhóm 12 - 16.',
    solution: `1) Số trung bình: x̄ = (12 + 13 + 14 + 14 + 15 + 16 + 45) / 7 = 129 / 7 ≈ 18,43.
2) Trung vị: Me = 14 (vị trí thứ 4).
3) Mốt: Mo = 14 (xuất hiện 2 lần).
4) Giải thích: Giá trị 45 là giá trị bất thường (outlier) làm cho số trung bình tăng vọt lên 18,43, cao hơn 6/7 số liệu còn lại. Trung vị 14 phản ánh trung thực mức độ sai số thông thường của cảm biến.`,
  },
  {
    id: 's2_lock5',
    stage: 2,
    taskNumber: 5,
    signalName: 'KHÓA 5 – BẢN ĐỒ TỌA ĐỘ SAO',
    dataset: [2, 4, 4, 5, 6, 7, 8, 10],
    unit: 'năm ánh sáng',
    contextDesc: 'Dữ liệu khoảng cách góc phân bố 8 chòm sao hộ tống UFO.',
    questionText: 'Tìm Q1, Q2, Q3 và xác định khoảng chứa 50% số liệu nằm giữa hai tứ phân vị.',
    difficulty: 'Thông hiểu',
    defaultTimeSeconds: 45,
    points: 20,
    type: 'stepped-analysis',
    statsBreakdown: {
      q1: 4,
      q2: 5.5,
      q3: 7.5,
      iqr: 3.5,
    },
    subQuestions: [
      { id: 's2_l5_a', label: 'a) Q1, Q2, Q3', prompt: 'Tìm các tứ phân vị:', answer: 'Q1 = 4; Q2 = 5,5; Q3 = 7,5', points: 10 },
      { id: 's2_l5_b', label: 'b) Khoảng 50% số liệu ở giữa', prompt: 'Xác định khoảng chứa 50% số liệu nằm giữa hai tứ phân vị:', answer: 'Từ 4 đến 7,5 (Khoảng tứ phân vị IQR = 3,5)', points: 10 },
    ],
    hint: 'n = 8 chẵn. Nửa dưới gồm 4 số: [2, 4, 4, 5] => Q1 = (4+4)/2 = 4. Nửa trên [6, 7, 8, 10] => Q3 = (7+8)/2 = 7,5.',
    solution: `1) Mẫu số liệu đã sắp xếp: 2; 4; 4; 5; 6; 7; 8; 10 (n = 8).
2) Q2 (Trung vị): Me = (5 + 6) / 2 = 5,5.
3) Tứ phân vị:
- Nửa dưới [2; 4; 4; 5] => Q1 = (4 + 4) / 2 = 4.
- Nửa trên [6; 7; 8; 10] => Q3 = (7 + 8) / 2 = 7,5.
4) Khoảng chứa 50% số liệu ở giữa là đoạn [Q1; Q3] = [4; 7,5].
Khoảng tứ phân vị: ΔQ = Q3 - Q1 = 7,5 - 4 = 3,5.`,
  },
];

export const STAGE_3_QUESTIONS: Question[] = [
  {
    id: 's3_master1',
    stage: 3,
    taskNumber: 1,
    signalName: 'MẬT MÃ 1 – THƯ VIỆN VŨ TRỤ',
    dataset: [1, 2, 2, 3, 3, 3, 4, 5, 12],
    unit: 'cuốn sách',
    contextDesc: 'Ghi nhận số lượng sách thiên văn học mà 9 học sinh đọc trong tháng du hành không gian.',
    questionText: 'Tính số trung bình, trung vị, mốt, tứ phân vị Q1, Q2, Q3 và phân tích ảnh hưởng của giá trị 12.',
    difficulty: 'Vận dụng cao',
    defaultTimeSeconds: 75,
    points: 25,
    type: 'stepped-analysis',
    statsBreakdown: {
      mean: 3.89,
      median: 3,
      mode: 3,
      q1: 2,
      q2: 3,
      q3: 4.5,
      outlierNote: '12 là giá trị bất thường',
    },
    subQuestions: [
      { id: 's3_m1_a', label: 'a) Số trung bình (x̄)', prompt: 'Tính số trung bình (dạng phân số hoặc số thập phân):', answer: '35/9 ≈ 3,89', points: 5 },
      { id: 's3_m1_b', label: 'b) Trung vị & Mốt', prompt: 'Tìm trung vị (Me) và mốt (Mo):', answer: 'Me = 3, Mo = 3', points: 5 },
      { id: 's3_m1_c', label: 'c) Các tứ phân vị', prompt: 'Tìm Q1, Q2, Q3:', answer: 'Q1 = 2; Q2 = 3; Q3 = 4,5', points: 5 },
      { id: 's3_m1_d', label: 'd) Ảnh hưởng giá trị 12', prompt: 'Giải thích ảnh hưởng của giá trị 12 đến số trung bình:', answer: '12 lớn bất thường làm tăng trung bình; Me và Mo = 3 phản ánh đúng mức phổ biến', points: 10 },
    ],
    hint: 'Tổng 9 số = 35. n = 9 lẻ, bỏ số thứ 5 (là 3). Nửa dưới [1, 2, 2, 3] có Q1 = 2. Nửa trên [3, 4, 5, 12] có Q3 = (4+5)/2 = 4,5.',
    solution: `1) Sắp xếp: 1; 2; 2; 3; 3; 3; 4; 5; 12 (n = 9).
2) Số trung bình: x̄ = 35 / 9 ≈ 3,89 (cuốn sách).
3) Trung vị: Me = 3 (số thứ 5). Mốt: Mo = 3 (lặp lại 3 lần).
4) Tứ phân vị:
- Bỏ Q2 = 3, nửa dưới là [1; 2; 2; 3] => Q1 = (2 + 2) / 2 = 2.
- Nửa trên là [3; 4; 5; 12] => Q3 = (4 + 5) / 2 = 4,5.
5) Nhận xét: Giá trị 12 lớn hơn đáng kể các giá trị khác nên làm số trung bình bị kéo tăng lên (3,89 > 3). Trong khi đó, trung vị và mốt đều bằng 3, thể hiện chính xác mức độ đọc sách phổ biến nhất của nhóm học sinh.`,
  },
  {
    id: 's3_master2',
    stage: 3,
    taskNumber: 2,
    signalName: 'MẬT MÃ 2 – SÂN VẬN ĐỘNG',
    dataset: [20120, 21315, 23405, 20120, 37546],
    unit: 'chỗ ngồi',
    contextDesc: 'Sức chứa của 5 sân vận động lớn trong mạng lưới các hành tinh liên minh.',
    questionText: 'Tính các số đặc trưng khi có đủ 5 sân, sau đó loại bỏ sân vận động Mỹ Đình (37.546 chỗ) và so sánh đại lượng nào bị biến đổi mạnh nhất.',
    difficulty: 'Vận dụng cao',
    defaultTimeSeconds: 90,
    points: 30,
    type: 'stepped-analysis',
    statsBreakdown: {
      mean: 24501.2,
      median: 21315,
      mode: 20120,
    },
    subQuestions: [
      { id: 's3_m2_a', label: 'a) Khi đủ 5 sân vận động', prompt: 'Tính số trung bình, trung vị và mốt:', answer: 'x̄ = 24.501,2; Me = 21.315; Mo = 20.120', points: 10 },
      { id: 's3_m2_b', label: 'b) Khi loại bỏ sân Mỹ Đình (37.546)', prompt: 'Tính lại ba đại lượng trên:', answer: 'x̄ = 21.240; Me = 20.717,5; Mo = 20.120', points: 10 },
      { id: 's3_m2_c', label: 'c) So sánh và kết luận', prompt: 'Đại lượng nào bị ảnh hưởng rõ nhất và vì sao?', answer: 'Số trung bình thay đổi mạnh nhất (giảm hơn 3.261 đơn vị)', points: 10 },
    ],
    hint: 'Sắp xếp 5 số: 20.120; 20.120; 21.315; 23.405; 37.546. Khi bỏ 37.546, còn 4 số với tổng 84.960.',
    solution: `1) Khi có đủ 5 sân:
- Sắp xếp: 20.120; 20.120; 21.315; 23.405; 37.546 (n = 5).
- Số trung bình: x̄ = 122.506 / 5 = 24.501,2.
- Trung vị: Me = 21.315.
- Mốt: Mo = 20.120 (xuất hiện 2 lần).

2) Khi loại bỏ sân Mỹ Đình (37.546 chỗ):
- Còn 4 sân: 20.120; 20.120; 21.315; 23.405 (n = 4).
- Số trung bình mới: x̄' = 84.960 / 4 = 21.240.
- Trung vị mới: Me' = (20.120 + 21.315) / 2 = 20.717,5.
- Mốt: Mo' = 20.120.

3) Kết luận:
- Số trung bình giảm tới 3.261,2 đơn vị (từ 24.501,2 xuống 21.240).
- Trung vị chỉ giảm nhẹ 597,5 đơn vị. Mốt không đổi.
=> Số trung bình là đại lượng bị ảnh hưởng rõ rệt nhất bởi sự có mặt của giá trị lớn ngoại lai (37.546).`,
  },
  {
    id: 's3_master3',
    stage: 3,
    taskNumber: 3,
    signalName: 'MẬT MÃ 3 – HAI ĐỘI PHI HÀNH',
    dataset: {
      'Đội A': [6, 7, 7, 8, 8, 8, 9, 10],
      'Đội B': [4, 6, 7, 8, 8, 9, 10, 11],
    },
    unit: 'nhiệm vụ',
    contextDesc: 'Số nhiệm vụ hoàn thành trong 8 chu kỳ huấn luyện của Đội A và Đội B.',
    questionText: 'Tính số trung bình, trung vị, mốt và tứ phân vị của mỗi đội. So sánh xem đội nào có phong độ ổn định hơn dựa trên khoảng tứ phân vị.',
    difficulty: 'Vận dụng cao',
    defaultTimeSeconds: 90,
    points: 30,
    type: 'stepped-analysis',
    subQuestions: [
      { id: 's3_m3_a', label: 'a) Chỉ số Đội A & Đội B', prompt: 'Tính x̄, Me, Mo của Đội A và Đội B:', answer: 'Cả 2 đội đều có x̄ = 7,875; Me = 8; Mo = 8', points: 10 },
      { id: 's3_m3_b', label: 'b) Tứ phân vị Q1, Q3, IQR', prompt: 'Tìm Q1, Q3 và khoảng tứ phân vị (IQR) mỗi đội:', answer: 'Đội A: IQR = 1,5. Đội B: IQR = 3', points: 10 },
      { id: 's3_m3_c', label: 'c) Nhận xét độ ổn định', prompt: 'Đội nào có kết quả ổn định hơn và tại sao?', answer: 'Đội A ổn định hơn vì khoảng tứ phân vị IQR nhỏ hơn (1,5 < 3)', points: 10 },
    ],
    hint: 'Tổng số nhiệm vụ của cả 2 đội đều bằng 63, chia 8 đều ra 7,875! Hãy tính IQR = Q3 - Q1 để so sánh độ phân tán 50% dữ liệu ở giữa.',
    solution: `1) Đội A: 6; 7; 7; 8; 8; 8; 9; 10 (n = 8).
- Số trung bình: x̄_A = 63 / 8 = 7,875.
- Trung vị: Me_A = (8 + 8) / 2 = 8.
- Mốt: Mo_A = 8 (xuất hiện 3 lần).
- Q1_A = (7 + 7) / 2 = 7; Q3_A = (8 + 9) / 2 = 8,5.
- Khoảng tứ phân vị: ΔQ_A = 8,5 - 7 = 1,5.

2) Đội B: 4; 6; 7; 8; 8; 9; 10; 11 (n = 8).
- Số trung bình: x̄_B = 63 / 8 = 7,875.
- Trung vị: Me_B = (8 + 8) / 2 = 8.
- Mốt: Mo_B = 8 (xuất hiện 2 lần).
- Q1_B = (6 + 7) / 2 = 6,5; Q3_B = (9 + 10) / 2 = 9,5.
- Khoảng tứ phân vị: ΔQ_B = 9,5 - 6,5 = 3.

3) Kết luận:
Hai đội có số trung bình (7,875), trung vị (8) và mốt (8) hoàn toàn như nhau. Tuy nhiên, Đội A có khoảng tứ phân vị nhỏ hơn (1,5 so với 3), cho thấy 50% số liệu nằm giữa tập trung sát giá trị trung tâm hơn, mức độ phân tán ít hơn. Do đó, Đội A có kết quả ổn định hơn xét theo khoảng tứ phân vị.`,
  },
];
