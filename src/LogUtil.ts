
export default class LogUtil {
  private static green = '\x1b[32m';
  private static red = '\x1b[31m';
  private static resetColor = '\x1b[0m';
  private static yellow = '\x1b[33m';
  
  public static error(message: string) {
    console.log(this.red, message);
  }

  public static success(message: string) {
    console.log(this.green, message);
  }

  public static info(message: string) {
    console.log(this.yellow, message);
  }
  public static log(message: string) {
    console.log(this.resetColor, message);
  }
}