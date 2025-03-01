// 时间戳 转为 本地时间
export const convertTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const formatTime = (gmtDate) => {
    const t = new Date(gmtDate); // 将 GMT 时间转换为 Date 对象
    const now = new Date();

    // 计算时间差（单位：天）
    let diffInDays = Math.floor((now - t) / (24 * 60 * 60 * 1000)); // 向下取整

    if (diffInDays < 0) {
        diffInDays = Math.floor((t - now) / (24 * 60 * 60 * 1000));
        if (diffInDays < 1) {
            // 计算时间差（单位：小时）
            const diffInHours = Math.floor((now - t) / (60 * 60 * 1000));
            // 一天之内
            if (diffInHours < 0) {
                // 一小时内
                // 计算时间差（单位：分钟）
                const diffInMinutes = Math.floor((now - t) / (60 * 1000));
                return `${diffInMinutes}分钟后`;
            } else {
                return `${diffInHours}小时后`;
            }
        } else if (diffInDays < 7) {
            // 一周之内
            return `${diffInDays}天后`;
        } else if (diffInDays < 30) {
            // 一个月内
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks}周后`;
        } else if (diffInDays < 365) {
            // 一年内
            const months = Math.floor(diffInDays / 30); // 简化处理，假设每月30天
            return `${months}个月后`;
        } else {
            // 一年以上
            const years = Math.floor(diffInDays / 365); // 简化处理，假设每年365天
            return `${years}年后`;
        }
    } else if (diffInDays < 1) {
        // 计算时间差（单位：小时）
        const diffInHours = Math.floor((now - t) / (60 * 60 * 1000));
        // 一天之内
        if (diffInHours < 0) {
            // 一小时内
            // 计算时间差（单位：分钟）
            const diffInMinutes = Math.floor((now - t) / (60 * 1000));
            return `${diffInMinutes}分钟前`;
        } else {
            return `${diffInHours}小时前`;
        }
    } else if (diffInDays < 7) {
        // 一周之内
        return `${diffInDays}天前`;
    } else if (diffInDays < 30) {
        // 一个月内
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks}周前`;
    } else if (diffInDays < 365) {
        // 一年内
        const months = Math.floor(diffInDays / 30); // 简化处理，假设每月30天
        return `${months}个月前`;
    } else {
        // 一年以上
        const years = Math.floor(diffInDays / 365); // 简化处理，假设每年365天
        return `${years}年前`;
    }
};
