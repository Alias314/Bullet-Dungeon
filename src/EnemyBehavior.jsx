
export function rush(playerPos, enemyPos, speed) {
    const velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    if (playerPos.x < enemyPos.x) velocity.x = -speed;
    if (playerPos.x > enemyPos.x) velocity.x = speed;
    if (playerPos.z < enemyPos.z) velocity.z = -speed;
    if (playerPos.z > enemyPos.z) velocity.z = speed;

    return velocity;
}

export function wander(positionToWander, enemyPos, speed) {
    const velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    if (positionToWander.x < enemyPos.x) velocity.x = -speed;
    if (positionToWander.x > enemyPos.x) velocity.x = speed;
    if (positionToWander.z < enemyPos.z) velocity.z = -speed;
    if (positionToWander.z > enemyPos.z) velocity.z = speed;

    return velocity;
}

export function stalk(playerPos, enemyPos, speed) {
    const velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    const distanceToStalk = Math.PI * 1.5;
    const absoluteDistanceX = Math.abs(playerPos.x - enemyPos.x);
    const absoluteDistanceZ = Math.abs(playerPos.z - enemyPos.z);

    if (playerPos.x < enemyPos.x) velocity.x = -speed;
    if (playerPos.x > enemyPos.x) velocity.x = speed;
    if (playerPos.z < enemyPos.z) velocity.z = -speed;
    if (playerPos.z > enemyPos.z) velocity.z = speed;

    if (absoluteDistanceX < distanceToStalk && absoluteDistanceZ < distanceToStalk) {
        if (playerPos.x < enemyPos.x) velocity.x = speed;
        if (playerPos.x > enemyPos.x) velocity.x = -speed;
        if (playerPos.z < enemyPos.z) velocity.z = speed;
        if (playerPos.z > enemyPos.z) velocity.z = -speed;
    }

    return velocity;
}