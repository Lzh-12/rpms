// 设置表头样式
export function tableRowClassName({row, rowIndex}) {
    console.log(row, rowIndex);
    if (rowIndex === 0) {
      return "success-row";
    }
    return "";
  }
